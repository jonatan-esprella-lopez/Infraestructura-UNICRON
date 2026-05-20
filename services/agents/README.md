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

<<<<<<< HEAD
Ver `.env.example`. Las obligatorias son: `DEEPSEEK_API_KEY`, `VOYAGE_API_KEY`, `TELEGRAM_BOT_TOKEN` y `DATABASE_URL`.

`LANGSMITH_TRACING` es opcional. Dejalo en `false` si no tenes una clave valida de LangSmith.
=======
Ver `.env.example`. Las obligatorias son: `ANTHROPIC_API_KEY`, `TELEGRAM_BOT_TOKEN`, `DATABASE_URL`.
>>>>>>> origin/exp/pres

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
<<<<<<< HEAD




# Cómo correr CasaLens — guía rápida

Todos los comandos se corren desde el *root del monorepo* salvo que se indique lo contrario.
Abrí una terminal por cada servicio.

---

## 1. Infra (Postgres + Redis)

*Requisito:* Docker Desktop corriendo.

powershell
docker compose -f infra/docker/local/docker-compose.yml up -d postgres redis


Verificar que postgres está healthy:
powershell
docker ps

Debe mostrar (healthy) en la columna STATUS del contenedor postgres.

*Apagar:*
powershell
docker compose -f infra/docker/local/docker-compose.yml down


---

## 2. Telegram Bot (Lead Qualifier)

*Terminal A* — desde services/agents/:

powershell
cd services/agents
.venv\Scripts\activate
python -m app.telegram.bot


Salida esperada:

Bot corriendo... Ctrl+C para detener.


Detener: Ctrl+C

---

## 3. FastAPI (Agents API)

*Terminal B* — desde services/agents/:

powershell
cd services/agents
.venv\Scripts\activate
uvicorn app.api.main:app --reload --port 8000


Salida esperada:

INFO:     Uvicorn running on http://127.0.0.1:8000


Endpoints disponibles:
- GET  http://localhost:8000/health
- GET  http://localhost:8000/leads/{lead_id}
- GET  http://localhost:8000/leads/{lead_id}/matches
- POST http://localhost:8000/contracts/analyze

Detener: Ctrl+C

---

## 4. Web Dashboard (React + Vite)

*Terminal C* — desde el root:

powershell
npm run dev:web


Salida esperada:

  ➜  Local:   http://localhost:5173/


URLs útiles:
- http://localhost:5173/app/dashboard
- http://localhost:5173/app/matcher?lead=<lead_id>

Detener: Ctrl+C

---

## Scripts puntuales (correr una vez)

Desde services/agents/ con el venv activo:

powershell
cd services/agents
.venv\Scripts\activate

# Generar 25 propiedades sintéticas con embeddings
python -m app.data.synthetic_properties

# Aplicar schema SQL (solo si se recreó la base)
$id = docker ps -qf "name=postgres"
Get-Content app/db/schema.sql | docker exec -i $id psql -U unicron -d unicron


---

## Verificar datos en Postgres

powershell
$id = docker ps -qf "name=postgres"

# Ver leads capturados por el bot
docker exec -it $id psql -U unicron -d unicron -c "SELECT id, operation_type, budget_usd, zones FROM leads;"

# Ver propiedades con embeddings
docker exec -it $id psql -U unicron -d unicron -c "SELECT id, title, zone, operation_type FROM properties LIMIT 5;"


---

## Orden de arranque recomendado


Terminal A  →  1. Infra (docker compose up)
Terminal B  →  2. FastAPI (uvicorn)
Terminal C  →  3. Web (npm run dev:web)
Terminal D  →  4. Bot Telegram (python -m app.telegram.bot)


La infra debe estar healthy antes de levantar FastAPI o el bot.
=======
>>>>>>> origin/exp/pres
