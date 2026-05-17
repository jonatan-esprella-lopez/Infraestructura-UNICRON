import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.db.connection import get_pool, save_lead, save_financial_profile
from app.agents.property_matcher import search_properties, rerank_with_llm
from app.agents.contract_reviewer import analyze_contract
from app.graphs.lead_graph import lead_graph
from app.graphs.financial_graph import financial_graph
from langchain_core.messages import HumanMessage

app = FastAPI(title="CasaLens Agents API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"ok": True}


@app.get("/leads/{lead_id}")
async def get_lead(lead_id: str):
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow("SELECT * FROM leads WHERE id = $1", lead_id)
    if not row:
        raise HTTPException(status_code=404, detail="Lead no encontrado")
    data = dict(row)
    if isinstance(data.get("profile"), str):
        data["profile"] = json.loads(data["profile"])
    return data


@app.get("/leads/{lead_id}/matches")
async def get_matches(lead_id: str):
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow("SELECT * FROM leads WHERE id = $1", lead_id)
        if not row:
            raise HTTPException(status_code=404, detail="Lead no encontrado")

    lead = dict(row)
    if isinstance(lead.get("profile"), str):
        lead["profile"] = json.loads(lead["profile"])

    profile = lead.get("profile") or {}
    search_lead = {
        "operation_type": lead.get("operation_type"),
        "budget_usd": float(lead["budget_usd"]) if lead.get("budget_usd") else None,
        "rooms": int(lead["rooms"]) if lead.get("rooms") else None,
        "zones": lead.get("zones") or [],
        "extras": profile.get("extras") or {},
    }

    candidates = await search_properties(search_lead)
    if not candidates:
        return {"lead_id": lead_id, "matches": [], "message": "No se encontraron propiedades con ese perfil"}

    matches = await rerank_with_llm(candidates, search_lead)
    return {"lead_id": lead_id, "matches": matches}


class ChatIn(BaseModel):
    session_id: str
    message: str


class ContractIn(BaseModel):
    text: str
    operation_type: str = "alquiler"


@app.post("/chat")
async def chat(payload: ChatIn):
    config = {"configurable": {"thread_id": payload.session_id}}
    state = await lead_graph.ainvoke(
        {"messages": [HumanMessage(content=payload.message)]},
        config=config,
    )

    last_msg = state["messages"][-1]
    complete = state.get("complete", False)
    lead_id = None

    if complete:
        lead_id = await save_lead(
            chat_id=hash(payload.session_id) & 0x7FFFFFFF,
            profile=state.get("lead_profile", {}),
        )

    reply = last_msg.content if isinstance(last_msg.content, str) else ""
    profile = state.get("lead_profile") or {}
    suggestions, hint = _suggestions_for(reply, profile) if not complete else ([], None)
    return {
        "reply": reply,
        "complete": complete,
        "lead_id": lead_id,
        "suggestions": suggestions,
        "hint": hint,
    }


def _suggestions_for(reply: str, profile: dict) -> tuple[list[str], str | None]:
    """Retorna (sugerencias, hint). Keyword matching sobre la pregunta del agente."""
    r = reply.lower()

    # Tipo de operación
    if any(w in r for w in ["alquiler", "anticrético", "comprar", "venta", "operación", "buscás algo", "buscando"]):
        if not profile.get("operation_type"):
            return ["Alquiler", "Anticrético", "Compra"], None

    # Dormitorios — antes de presupuesto para que "cuántos dormitorios" no dispare precios
    if any(w in r for w in ["dormitorio", "habitación", "cuarto", "pieza", "ambiente", "dorm"]):
        return ["1 dormitorio", "2 dormitorios", "3 dormitorios", "4 o más"], None

    # Presupuesto — sin opciones, solo hint
    if any(w in r for w in ["presupuesto", "cuánto", "monto", "mensual", "disponés", "precio", "valor", "invertir"]):
        return [], "Escribí el monto en USD, ej: 25000"

    # Zona
    if any(w in r for w in ["zona", "barrio", "sector", "dónde", "lugar", "área", "ubicación"]):
        return ["Recoleta", "Cala Cala", "Queru Queru", "Sur", "Escribir otra opción"], None

    # Urgencia / plazo
    if any(w in r for w in ["urgente", "cuándo", "plazo", "tiempo", "semana", "pronto"]):
        return ["Esta semana", "Este mes", "En 2-3 meses", "Sin urgencia"], None

    # Mascotas
    if any(w in r for w in ["mascota", "perro", "gato", "pet", "animal"]):
        return ["Sí, tengo mascota", "No tengo mascotas"], None

    # Parking
    if any(w in r for w in ["parking", "garaje", "estacionamiento", "cochera"]):
        return ["Sí, necesito parking", "No necesito parking"], None

    # Fallback
    if not profile.get("operation_type"):
        return ["Alquiler", "Anticrético", "Compra"], None
    if not profile.get("zones"):
        return ["Recoleta", "Cala Cala", "Queru Queru", "Sur", "Escribir otra opción"], None
    if not profile.get("rooms"):
        return ["1 dormitorio", "2 dormitorios", "3 dormitorios"], None

    return [], None


@app.post("/financial-chat")
async def financial_chat(payload: ChatIn):
    config = {"configurable": {"thread_id": f"fin-{payload.session_id}"}}
    state = await financial_graph.ainvoke(
        {"messages": [HumanMessage(content=payload.message)]},
        config=config,
    )

    last_msg = state["messages"][-1]
    complete = state.get("complete", False)
    evaluation = state.get("evaluation") or {}
    profile_id = None

    if complete and evaluation:
        profile_id = await save_financial_profile(
            session_id=payload.session_id,
            profile=state.get("financial_profile", {}),
            evaluation=evaluation,
        )

    reply = last_msg.content if isinstance(last_msg.content, str) else ""
    profile = state.get("financial_profile") or {}
    suggestions = _financial_suggestions_for(reply, profile) if not complete else []

    return {
        "reply": reply,
        "complete": complete,
        "profile_id": profile_id,
        "evaluation": evaluation if complete else None,
        "suggestions": suggestions,
    }


def _financial_suggestions_for(reply: str, profile: dict) -> list[str]:
    r = reply.lower()

    if any(w in r for w in ["dependiente", "independiente", "relación de dependencia", "trabajo", "empleo", "ingreso"]):
        if not profile.get("income_type"):
            return ["Dependiente (en planilla)", "Independiente / Freelance"]

    if any(w in r for w in ["ingreso", "ganás", "ganas", "sueldo", "salario", "mensual"]):
        return []

    if any(w in r for w in ["gasto", "expense", "fijo", "mensual", "luz", "agua", "alquiler", "educación"]):
        return []

    if any(w in r for w in ["deuda", "préstamo", "prestamo", "tarjeta", "cuota", "crédito activo"]):
        return ["No tengo deudas activas", "Sí, tengo préstamos"]

    if any(w in r for w in ["ahorro", "capital", "disponible", "guardado", "anticipo"]):
        return []

    if any(w in r for w in ["infocenter", "historial", "mora", "crediticio"]):
        return ["Sin problemas crediticios", "Tuve alguna mora"]

    if any(w in r for w in ["cargo", "depend", "familia", "hijos", "hijxs"]):
        return ["Ninguno", "1 persona", "2 personas", "3 o más"]

    if not profile.get("income_type"):
        return ["Dependiente (en planilla)", "Independiente / Freelance"]

    return []


@app.post("/contracts/analyze")
async def analyze_contract_endpoint(payload: ContractIn):
    result = await analyze_contract(payload.text, payload.operation_type)
    return result
