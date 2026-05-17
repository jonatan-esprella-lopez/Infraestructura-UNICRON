import json
import voyageai
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
from app.config import DEEPSEEK_API_KEY, MATCH_MODEL, VOYAGE_API_KEY
from app.db.connection import get_pool

voyage = voyageai.AsyncClient(api_key=VOYAGE_API_KEY)

llm = ChatOpenAI(
    model=MATCH_MODEL,
    api_key=DEEPSEEK_API_KEY,
    base_url="https://api.deepseek.com",
    temperature=0,
)

RERANK_PROMPT = """Te paso candidatos de propiedades y el perfil de un buscador.
Devolveme las top 5 ordenadas por encaje real con el perfil, con UNA razón corta (máx 12 palabras).

JSON estricto, sin texto adicional:
{{
  "ranked": [
    {{"property_id": "P-001", "score": 0.92, "reason": "..."}}
  ]
}}

Perfil del buscador:
{profile}

Propiedades candidatas:
{candidates}"""


async def search_properties(lead: dict, k: int = 10) -> list[dict]:
    """Filtro duro SQL + vector search."""
    operation_type = lead.get("operation_type")
    query_text = _build_query_text(lead)
    embed_resp = await voyage.embed([query_text], model="voyage-3-lite", input_type="query")
    query_embedding = embed_resp.embeddings[0]

    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT id, title, description, operation_type, price_usd,
                   zone, rooms, bathrooms, area_m2, has_parking, pet_friendly,
                   photo_urls,
                   1 - (embedding <=> $1::vector) AS similarity
            FROM properties
            WHERE ($2::text IS NULL OR operation_type = $2)
            ORDER BY embedding <=> $1::vector
            LIMIT $3
            """,
            query_embedding,
            operation_type,
            k,
        )

    return [dict(r) for r in rows]


async def rerank_with_llm(candidates: list[dict], lead: dict) -> list[dict]:
    """Re-rankea con DeepSeek y agrega razones legibles."""
    if not candidates:
        return []

    simplified = [
        {
            "property_id": c["id"],
            "title": c["title"],
            "zone": c["zone"],
            "operation_type": c["operation_type"],
            "price_usd": float(c["price_usd"]),
            "rooms": c["rooms"],
            "area_m2": float(c["area_m2"]),
            "has_parking": c["has_parking"],
            "pet_friendly": c["pet_friendly"],
            "description": c["description"],
        }
        for c in candidates
    ]

    prompt = RERANK_PROMPT.format(
        profile=json.dumps(lead, ensure_ascii=False),
        candidates=json.dumps(simplified, ensure_ascii=False, indent=2),
    )

    resp = await llm.ainvoke([HumanMessage(content=prompt)])
    raw = resp.content.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]

    ranked = json.loads(raw.strip())["ranked"]

    candidate_map = {c["id"]: c for c in candidates}
    results = []
    for item in ranked[:5]:
        pid = item["property_id"]
        if pid not in candidate_map:
            continue
        prop = candidate_map[pid]
        results.append({
            "property_id": pid,
            "title": prop["title"],
            "zone": prop["zone"],
            "operation_type": prop["operation_type"],
            "price_usd": float(prop["price_usd"]),
            "rooms": prop["rooms"],
            "bathrooms": prop["bathrooms"],
            "area_m2": float(prop["area_m2"]),
            "has_parking": prop["has_parking"],
            "pet_friendly": prop["pet_friendly"],
            "photo_urls": list(prop["photo_urls"]) if prop.get("photo_urls") else [],
            "score": item["score"],
            "reason": item["reason"],
        })

    return results


def _build_query_text(lead: dict) -> str:
    parts = []
    if lead.get("operation_type"):
        parts.append(lead["operation_type"])
    if lead.get("zones"):
        parts.append("en " + ", ".join(lead["zones"]))
    if lead.get("rooms"):
        parts.append(f"{lead['rooms']} dormitorios")
    if lead.get("budget_usd"):
        parts.append(f"USD {lead['budget_usd']}")
    extras = lead.get("extras") or {}
    if extras.get("pet_friendly"):
        parts.append("pet friendly")
    if extras.get("parking"):
        parts.append("con parking")
    return " ".join(parts) if parts else "departamento en Cochabamba"
