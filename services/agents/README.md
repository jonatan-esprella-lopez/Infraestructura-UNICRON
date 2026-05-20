# CasaLens Agents Service

Servicio Python con agentes para lead qualification, property matching y contract review.

## Variables requeridas

Ver `.env.example`. Las obligatorias son:

- `DEEPSEEK_API_KEY`
- `VOYAGE_API_KEY`
- `TELEGRAM_BOT_TOKEN`
- `DATABASE_URL`

Variables de despliegue usadas por el entorno actual:

- `SERVICE_PUBLIC_URL=https://casalens-agents-production.up.railway.app`
- `BACKEND_API_URL=https://infraestructura-unicron-api.vercel.app`
- `FRONTEND_URL=https://wasi.pages.dev`

`LANGSMITH_TRACING` es opcional. Dejalo en `false` si no tienes una clave valida de LangSmith.

## Setup local

```bash
cd services/agents
python -m venv .venv
.venv\Scripts\activate
pip install -e .
```

## Correr FastAPI

```bash
cd services/agents
.venv\Scripts\activate
uvicorn app.api.main:app --reload --port 8000
```

Endpoints principales:

- `GET /health`
- `GET /leads/{lead_id}`
- `GET /leads/{lead_id}/matches`
- `POST /contracts/analyze`

## Correr Telegram bot

```bash
cd services/agents
.venv\Scripts\activate
python -m app.telegram.bot
```

## Scripts puntuales

```bash
cd services/agents
.venv\Scripts\activate
python -m app.data.synthetic_properties
```
