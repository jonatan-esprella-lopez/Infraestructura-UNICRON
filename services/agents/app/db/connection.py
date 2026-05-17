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
        row = await conn.fetchrow(
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
            RETURNING id
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

    return row["id"]


async def save_financial_profile(*, session_id: str, profile: dict, evaluation: dict) -> str:
    import json
    import uuid

    pool = await get_pool()
    profile_id = f"FP-{uuid.uuid4().hex[:8].upper()}"
    verdict = evaluation.get("verdict", "condicionado")

    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            INSERT INTO financial_profiles (id, session_id, profile, evaluation, verdict)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (session_id) DO UPDATE
              SET profile    = EXCLUDED.profile,
                  evaluation = EXCLUDED.evaluation,
                  verdict    = EXCLUDED.verdict
            RETURNING id
            """,
            profile_id,
            session_id,
            json.dumps(profile),
            json.dumps(evaluation),
            verdict,
        )

    return row["id"]
