import asyncpg
from pgvector.asyncpg import register_vector
from app.config import DATABASE_URL

_pool: asyncpg.Pool | None = None


async def get_pool() -> asyncpg.Pool:
    global _pool
    if _pool is None:
        _pool = await asyncpg.create_pool(
            DATABASE_URL,
            min_size=2,
            max_size=10,
            init=register_vector,
        )
    return _pool


async def save_lead(*, chat_id: int, profile: dict) -> str:
    import json
    import uuid

    pool = await get_pool()
    lead_id = f"L-{uuid.uuid4().hex[:8].upper()}"

    async with pool.acquire() as conn:
        await conn.execute(
            """
            INSERT INTO leads (id, telegram_chat_id, operation_type, budget_usd, zones,
                               rooms, timing_weeks, profile)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (telegram_chat_id) DO UPDATE
              SET operation_type = EXCLUDED.operation_type,
                  budget_usd     = EXCLUDED.budget_usd,
                  zones          = EXCLUDED.zones,
                  rooms          = EXCLUDED.rooms,
                  timing_weeks   = EXCLUDED.timing_weeks,
                  profile        = EXCLUDED.profile
            """,
            lead_id,
            chat_id,
            profile.get("operation_type"),
            profile.get("budget_usd"),
            profile.get("zones") or [],
            profile.get("rooms"),
            profile.get("timing_weeks"),
            json.dumps(profile),
        )

    return lead_id
