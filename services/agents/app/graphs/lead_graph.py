from typing import Annotated, TypedDict
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage, BaseMessage
from langgraph.graph.message import add_messages
import json
from app.config import LEAD_MODEL, DEEPSEEK_API_KEY

SYSTEM_PROMPT = """Sos CasaLens, asistente inmobiliario boliviano. Tu trabajo es entender qué busca esta persona
en 4-5 preguntas naturales, no como formulario. Usá modismos bolivianos suaves cuando encaje.
Datos que necesitas extraer:
- operation_type: "alquiler" | "venta"
- budget_usd: número aproximado (en alquiler es mensual, en venta es total)
- city: ciudad de Bolivia donde busca (Cochabamba, Santa Cruz, La Paz, Tarija, Potosí, Beni, Chuquisaca)
- rooms: dormitorios deseados
- timing_weeks: cuán urgente es (en semanas, opcional)
- extras: mascotas, parking, etc.

Estilo: corto, UNA sola pregunta por mensaje. Si la persona ya dio info, no la vuelvas a pedir.
Cuando tengas operation_type, budget_usd, city y rooms completos, decí exactamente:
"Perfecto, ya tengo lo que necesito. Te paso unas propiedades en un momento." y no hagas más preguntas."""

EXTRACT_PROMPT = """De la conversación siguiente, extraé un JSON con estos campos exactos:

- operation_type: "alquiler" | "venta" | null
- budget_usd: número | null
- city: "Cochabamba" | "Santa Cruz" | "La Paz" | "Tarija" | "Potosí" | "Beni" | "Chuquisaca" | null
- rooms: número entero | null
- timing_weeks: número entero | null
- extras: dict | null
- question_type: qué campo está pidiendo CasaLens en su ÚLTIMO mensaje.
  Elegí EXACTAMENTE UNO de estos valores:
  "operation_type" | "property_type" | "city" | "rooms" | "budget" | "timing" | "parking" | "pets" | "none"
  Si el último mensaje de CasaLens no tiene pregunta (es el mensaje de cierre), usá "none".

Reglas:
- Si algún campo del perfil no fue mencionado, ponelo en null.
- Respondé SOLO con JSON válido, sin markdown, sin texto extra.

Conversación:
{conversation}"""


class LeadState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]
    lead_profile: dict
    question_type: str
    complete: bool


llm = ChatOpenAI(
    model=LEAD_MODEL,
    api_key=DEEPSEEK_API_KEY,
    base_url="https://api.deepseek.com",
    temperature=0.3,
)

llm_extract = ChatOpenAI(
    model=LEAD_MODEL,
    api_key=DEEPSEEK_API_KEY,
    base_url="https://api.deepseek.com",
    temperature=0,
)

VALID_QUESTION_TYPES = {
    "operation_type", "property_type", "city",
    "rooms", "budget", "timing", "parking", "pets", "none",
}


async def chat_node(state: LeadState) -> dict:
    msgs = [SystemMessage(content=SYSTEM_PROMPT)] + state["messages"]
    response = await llm.ainvoke(msgs)
    return {"messages": [response]}


async def extract_node(state: LeadState) -> dict:
    conversation = "\n".join(
        f"{'Usuario' if isinstance(m, HumanMessage) else 'CasaLens'}: {m.content}"
        for m in state["messages"]
    )
    resp = await llm_extract.ainvoke(
        [HumanMessage(content=EXTRACT_PROMPT.format(conversation=conversation))]
    )

    try:
        raw = resp.content.strip()
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        data = json.loads(raw.strip())
    except Exception:
        data = {}

    question_type = str(data.pop("question_type", "none")).strip().lower()
    if question_type not in VALID_QUESTION_TYPES:
        question_type = "none"

    profile = {
        "operation_type": data.get("operation_type"),
        "budget_usd": data.get("budget_usd"),
        "city": data.get("city"),
        "rooms": data.get("rooms"),
        "timing_weeks": data.get("timing_weeks"),
        "extras": data.get("extras"),
    }
    # Preserve previous profile values if extract came back empty
    prev = state.get("lead_profile") or {}
    for k, v in profile.items():
        if v is None and prev.get(k) is not None:
            profile[k] = prev[k]

    required = ["operation_type", "budget_usd", "city", "rooms"]
    complete = all(profile.get(k) for k in required)

    last_reply = state["messages"][-1].content if state["messages"] else ""
    closing_phrases = ["ya tengo lo que necesito", "te paso unas propiedades"]
    if any(p in last_reply.lower() for p in closing_phrases):
        complete = True
    elif "?" in last_reply:
        complete = False

    return {"lead_profile": profile, "question_type": question_type, "complete": complete}


_graph = StateGraph(LeadState)
_graph.add_node("chat", chat_node)
_graph.add_node("extract", extract_node)
_graph.set_entry_point("chat")
_graph.add_edge("chat", "extract")
_graph.add_edge("extract", END)

lead_graph = _graph.compile(checkpointer=MemorySaver())
