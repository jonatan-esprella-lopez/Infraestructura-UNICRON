import asyncio
import json
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
import voyageai
from app.config import DEEPSEEK_API_KEY, MATCH_MODEL, VOYAGE_API_KEY
from app.db.connection import get_pool

PROMPT = """Generá 25 propiedades inmobiliarias realistas de Cochabamba, Bolivia, en JSON estricto.

Reglas:
- Mezclá zonas reales: Recoleta, Cala Cala, Tupuraya, Queru Queru, Sarco, Sur, Aranjuez, Centro
- Mezclá operation_type: alquiler (40%), anticretico (35%), venta (25%)
- Rangos de precios realistas:
  - alquiler: 200-1200 USD/mes
  - anticretico: 15000-80000 USD total
  - venta: 50000-300000 USD total
- descriptions de 2-3 frases con detalles concretos: luminoso, balcón, cocina abierta,
  vista a la verde, ascensor, piscina, quincho, cerca de colegios, etc.
- rooms: 1-4, bathrooms: 1-3, area_m2: 40-220
- has_parking y pet_friendly: distribuí realísticamente (no todo true)

Formato JSON estricto, sin texto adicional:
{
  "properties": [
    {
      "id": "P-001",
      "title": "...",
      "description": "...",
      "operation_type": "alquiler|anticretico|venta",
      "price_usd": 0,
      "zone": "...",
      "rooms": 0,
      "bathrooms": 0,
      "area_m2": 0,
      "has_parking": true,
      "pet_friendly": false
    }
  ]
}"""


async def main() -> None:
    llm = ChatOpenAI(
        model=MATCH_MODEL,
        api_key=DEEPSEEK_API_KEY,
        base_url="https://api.deepseek.com",
        temperature=0.8,
        max_tokens=4096,
    )
    voyage = voyageai.AsyncClient(api_key=VOYAGE_API_KEY)

    print("Generando propiedades con DeepSeek...")
    resp = await llm.ainvoke([HumanMessage(content=PROMPT)])

    raw = resp.content.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()

    data = json.loads(raw)
    props = data["properties"]
    print(f"  {len(props)} propiedades generadas.")

    print("Generando embeddings con Voyage...")
    descriptions = [p["description"] for p in props]
    embed_resp = await voyage.embed(descriptions, model="voyage-3-lite", input_type="document")
    embeddings = embed_resp.embeddings
    print(f"  {len(embeddings)} embeddings listos (dim={len(embeddings[0])}).")

    print("Insertando en Postgres...")
    pool = await get_pool()
    inserted = 0
    async with pool.acquire() as conn:
        for prop, emb in zip(props, embeddings):
            await conn.execute(
                """
                INSERT INTO properties (
                    id, title, description, operation_type, price_usd,
                    zone, rooms, bathrooms, area_m2, has_parking, pet_friendly,
                    embedding, raw
                ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
                ON CONFLICT (id) DO NOTHING
                """,
                prop["id"],
                prop["title"],
                prop["description"],
                prop["operation_type"],
                float(prop["price_usd"]),
                prop["zone"],
                int(prop["rooms"]),
                int(prop["bathrooms"]),
                float(prop["area_m2"]),
                bool(prop["has_parking"]),
                bool(prop["pet_friendly"]),
                emb,
                json.dumps(prop),
            )
            inserted += 1

    print(f"  {inserted} propiedades insertadas.")
    print("Listo.")


if __name__ == "__main__":
    asyncio.run(main())
