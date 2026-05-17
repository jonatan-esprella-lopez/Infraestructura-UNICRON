import voyageai
from app.config import VOYAGE_API_KEY
from app.db.connection import get_pool

_voyage = voyageai.AsyncClient(api_key=VOYAGE_API_KEY)


async def retrieve_context(query: str, top_k: int = 4) -> str:
    result = await _voyage.embed([query], model="voyage-3-lite", input_type="query")
    embedding = result.embeddings[0]

    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT source, chunk
            FROM financial_docs
            ORDER BY embedding <=> $1
            LIMIT $2
            """,
            embedding,
            top_k,
        )

    if not rows:
        return ""

    return "\n\n---\n\n".join(f"[{r['source']}]\n{r['chunk']}" for r in rows)
