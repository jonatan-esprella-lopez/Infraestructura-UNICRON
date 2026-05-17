CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS leads (
    id                  TEXT PRIMARY KEY,
    telegram_chat_id    BIGINT UNIQUE,
    operation_type      TEXT,
    budget_usd          NUMERIC,
    zones               TEXT[],
    rooms               INT,
    timing_weeks        INT,
    profile             JSONB,
    qualification_score NUMERIC,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS properties (
    id             TEXT PRIMARY KEY,
    title          TEXT,
    description    TEXT,
    operation_type TEXT,
    price_usd      NUMERIC,
    zone           TEXT,
    rooms          INT,
    bathrooms      INT,
    area_m2        NUMERIC,
    has_parking    BOOLEAN,
    pet_friendly   BOOLEAN,
    photo_urls     TEXT[],
    embedding      vector(512),
    raw            JSONB
);

CREATE INDEX IF NOT EXISTS properties_embedding_idx
    ON properties USING hnsw (embedding vector_cosine_ops);

CREATE TABLE IF NOT EXISTS financial_docs (
    id        SERIAL PRIMARY KEY,
    source    TEXT,
    chunk     TEXT,
    embedding vector(512)
);

CREATE INDEX IF NOT EXISTS financial_docs_embedding_idx
    ON financial_docs USING hnsw (embedding vector_cosine_ops);

CREATE TABLE IF NOT EXISTS financial_profiles (
    id          TEXT PRIMARY KEY,
    session_id  TEXT UNIQUE,
    profile     JSONB,
    evaluation  JSONB,
    verdict     TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);
