# CasaLens — Agents Service

Servicio Python con los 3 agentes LangGraph del MVP: Lead Qualifier (Telegram), Property Matcher y Contract Reviewer.

## Setup

```bash
cd services/agents
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -e .
cp .env.example .env           # completar con keys reales
```

## Variables de entorno requeridas

Ver `.env.example`. Las obligatorias son: `ANTHROPIC_API_KEY`, `TELEGRAM_BOT_TOKEN`, `DATABASE_URL`.

## Infra (desde el root del monorepo)

```bash
# Levantar solo lo necesario
docker compose -f infra/docker/local/docker-compose.yml up -d postgres redis

# Aplicar schema de CasaLens (tablas leads + properties en la base unicron)
docker exec -i $(docker ps -qf "name=postgres") \
  psql -U unicron -d unicron < services/agents/app/db/schema.sql
```

## Correr

```bash
# Terminal 1 — Telegram bot (Lead Qualifier)
cd services/agents && source .venv/bin/activate
python -m app.telegram.bot

# Terminal 2 — FastAPI (Matcher + Contract Reviewer)
cd services/agents && source .venv/bin/activate
uvicorn app.api.main:app --reload --port 8000

# Script puntual — generar propiedades sintéticas
python -m app.data.synthetic_properties
```

## Verificar

```bash
# Leads capturados por el bot
docker exec -it $(docker ps -qf "name=postgres") \
  psql -U unicron -d unicron -c "SELECT id, operation_type, profile FROM leads;"

# Propiedades con embeddings
docker exec -it $(docker ps -qf "name=postgres") \
  psql -U unicron -d unicron -c "SELECT id, title, zone FROM properties LIMIT 5;"
```
