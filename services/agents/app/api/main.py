import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.db.connection import get_pool
from app.agents.property_matcher import search_properties, rerank_with_llm

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
        "budget_usd": lead.get("budget_usd"),
        "rooms": lead.get("rooms"),
        "zones": lead.get("zones") or [],
        "extras": profile.get("extras") or {},
    }

    candidates = await search_properties(search_lead)
    if not candidates:
        return {"lead_id": lead_id, "matches": [], "message": "No se encontraron propiedades con ese perfil"}

    matches = await rerank_with_llm(candidates, search_lead)
    return {"lead_id": lead_id, "matches": matches}


class ContractIn(BaseModel):
    text: str
    operation_type: str = "alquiler"


@app.post("/contracts/analyze")
async def analyze_contract(payload: ContractIn):
    # TODO: implementar contract reviewer (Bloque 3)
    return {"status": "pending", "message": "Contract reviewer en construcción"}
