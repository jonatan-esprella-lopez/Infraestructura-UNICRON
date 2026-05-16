# CasaLens MVP — Plan de implementación Día 1 (Viernes)

> Hackathon: COCHATECH 2026 · Reto: Intersim Proptech
> Stack base: UNICRON monorepo (existente) + Python service nuevo
> Objetivo del día: 3 experimentos validados + Telegram bot vivo

---

## 1. Decisiones estratégicas (lee esto primero)

### 1.1 Telegram en vez de WhatsApp ✅
- **WhatsApp Business API** requiere verificación de Meta, número activo verificado y un proveedor (Twilio/Vonage). Tomaría ~24 horas solo para empezar a recibir mensajes.
- **Telegram Bot API** se crea en 60 segundos con @BotFather, sin verificación, sin costos, sin webhook obligatorio (puedes usar polling).
- Para el demo, Telegram se ve igual de "real" que WhatsApp: el jurado escanea QR, abre el bot, conversa. Es **mejor demo** que WhatsApp porque pueden probarlo en vivo desde su propio celular sin que tengas que agregarlos a una lista.
- Para producción, después se migra a WhatsApp con el mismo backend LangGraph (solo cambias la capa de mensajería).

### 1.2 LangGraph como orquestador ✅
- Es el ecosistema canónico de Anthropic/LangChain para agentes con estado.
- Tu TFG ya usa LangGraph + LangSmith → **reusas conocimiento y trazas**.
- `MemorySaver` para checkpoints hoy (in-memory). Mañana cambiamos a `PostgresSaver` si vale la pena.
- Tracing automático con LangSmith te va a ahorrar HORAS debuggeando.

### 1.3 Sin AWS hoy ✅
- AWS Bedrock para Claude tiene latencia mayor que llamar directo a la API de Anthropic. En hackathon eso importa.
- Lambda + API Gateway para Python toma 30-45 min de setup IAM que no tenemos.
- Hosteamos local con `ngrok` para exponer endpoints si hace falta (lo dudo hoy).
- El sábado, **si queremos puntos políticos**, deployamos solo el frontend a AWS Amplify (5 min, gratis). El backend Python se queda donde sea más rápido.

### 1.4 Python para agentes, TypeScript para web
- El servicio de agentes (LangGraph + Telegram bot) → **Python** en `services/agents/`.
- El dashboard web → **React + Vite de UNICRON**, lo reusamos casi tal cual.
- Se comunican vía HTTP/REST (FastAPI expone endpoints; React los llama).
- Esto **NO rompe** la estructura UNICRON porque `services/` es una carpeta nueva en el root, no interfiere con `apps/`, `packages/` ni los validators.

---

## 2. Qué del UNICRON repo nos sirve (auditoría explícita)

### 2.1 ✅ REUSAR tal cual

| Pieza | Por qué |
|---|---|
| `apps/web` (React + Vite + TS) | Es exactamente lo que necesitamos para el dashboard del Matcher y el Contract Reviewer. Los path aliases `@modules`, `@shared`, `@layouts` aceleran todo. |
| Pattern de `src/modules/<name>/` en web | Creamos `src/modules/leads/`, `src/modules/matcher/`, `src/modules/contracts/` sin tocar nada existente. |
| `src/routes/lazy.routes.ts` | Lazy loading + featureFlag + permissions. Saltamos `permissions` y `roles` hoy (sin auth), usamos solo el lazy loading. |
| `DashboardLayout` | Lo usamos para envolver las 3 pantallas del MVP. |
| `@unicron/ui` | Cualquier componente que ya exista (Button, Card, Input) lo aprovechamos. |
| `@unicron/types` | Definimos ahí los tipos compartidos `Lead`, `Property`, `ContractAnalysis`. |
| Path aliases (`@modules`, `@shared`, etc.) | Hacen el código limpio sin configurar nada. |
| Docker Compose `postgres` + `redis` | Postgres lo necesitamos (con pgvector). Redis nice-to-have para caché. |
| `infra/docker/local/.env` | Centralizamos las variables ahí. |

### 2.2 🔄 EXTENDER

| Pieza | Cambio | Por qué |
|---|---|---|
| Imagen de Postgres en `docker-compose.yml` | Cambiar `postgres:16` → `pgvector/pgvector:pg16` | Necesitamos extensión vector para embeddings del Matcher. Es drop-in compatible. |
| `infra/docker/local/.env` | Agregar `ANTHROPIC_API_KEY`, `TELEGRAM_BOT_TOKEN`, `VOYAGE_API_KEY`, `LANGSMITH_API_KEY`, `LANGSMITH_TRACING=true`, `LANGSMITH_PROJECT=casalens` | Variables que consumirá el servicio Python. |
| `package.json` raíz | Agregar scripts `dev:agents`, `infra:agents:logs` | Acceso uniforme desde `npm run`. |

### 2.3 ⏭️ NO USAR HOY (no romper, no extender)

| Pieza | Por qué saltarla hoy |
|---|---|
| `apps/api` (custom HTTP server TS) | El servidor custom es ingenioso pero acoplarlo a LangGraph en otro idioma sumaría 4-6 horas de fricción. **No lo borres**, solo no lo levantes hoy. El sábado, si hay tiempo, lo usamos como BFF (Backend-for-Frontend) que llama a Python. Por hoy: el web habla directo al Python service. |
| Validators (`validate:architecture`, etc.) | Pueden quebrar al detectar `services/agents/` como carpeta nueva no esperada. **Suspende** la ejecución de validators hoy. El domingo los corres antes del pitch, si gritan, los configuras para ignorar `services/`. |
| Generators (`generate:module`, etc.) | No vamos a generar módulos UNICRON porque los necesitamos asimétricos (frontend sin backend equivalente en TS). Hacemos los módulos web a mano. |
| `nginx`, `prometheus`, `grafana`, `loki` en infra | Sobreingeniería para hackathon. Los dejamos apagados (`docker compose up postgres redis` y nada más). |
| Tests / lint estrictos | Hoy escribimos para que funcione, no para que pase CI. Domingo limpiamos lo que vaya a verse en el repo del jurado. |

### 2.4 ➕ AGREGAR NUEVO

```
casalens/  ← tu fork del UNICRON renombrado, o branch en el mismo
├── apps/
│   ├── api/         ← intacto, dormido
│   └── web/         ← lo modificamos
├── packages/        ← intacto
├── services/        ← NUEVO
│   └── agents/      ← servicio Python con LangGraph + Telegram bot
│       ├── app/
│       │   ├── agents/
│       │   │   ├── lead_qualifier.py
│       │   │   ├── property_matcher.py
│       │   │   └── contract_reviewer.py
│       │   ├── graphs/
│       │   │   └── lead_graph.py     # LangGraph del Lead Qualifier
│       │   ├── telegram/
│       │   │   └── bot.py            # python-telegram-bot
│       │   ├── api/
│       │   │   └── main.py           # FastAPI endpoints
│       │   ├── db/
│       │   │   ├── connection.py     # asyncpg
│       │   │   └── schema.sql        # tablas + pgvector
│       │   ├── data/
│       │   │   ├── synthetic_properties.py  # generador
│       │   │   └── sample_contracts/        # contratos para testear
│       │   └── config.py
│       ├── pyproject.toml
│       ├── .env.example
│       └── README.md
└── infra/docker/local/
    └── docker-compose.yml  ← cambiar postgres a pgvector
```

---

## 3. Arquitectura del pre-MVP

```mermaid
flowchart LR
    User[👤 Usuario]
    Jury[🧑‍⚖️ Jurado]
    TG[Telegram Bot]
    Web[Web Dashboard<br/>React + Vite]

    subgraph PythonService[services/agents - Python 3.11+]
        BotApp[Telegram Polling]
        FastAPI[FastAPI :8000]
        subgraph LG[LangGraph orchestrator]
            LeadAgent[Lead Qualifier Agent<br/>Haiku 4.5]
            MatchAgent[Property Matcher Agent<br/>Sonnet 4 re-rank]
            LegalAgent[Contract Reviewer Agent<br/>Sonnet 4 + Logic Lens]
        end
    end

    PG[(Postgres + pgvector<br/>:5432)]
    Claude[Anthropic API]
    Voyage[Voyage embeddings]
    LangSmith[LangSmith tracing]

    User -- "mensaje" --> TG
    TG <--> BotApp
    BotApp --> LeadAgent

    Jury -- "navega" --> Web
    Web -- "GET /matches/:lead_id" --> FastAPI
    Web -- "POST /contracts/analyze" --> FastAPI
    FastAPI --> MatchAgent
    FastAPI --> LegalAgent

    LeadAgent --> PG
    MatchAgent --> PG
    LeadAgent <--> Claude
    MatchAgent <--> Claude
    LegalAgent <--> Claude
    MatchAgent <--> Voyage

    LG -.traces.-> LangSmith
```

**Lectura rápida:**
- El usuario habla por Telegram → entra al Lead Qualifier → se guarda el perfil en Postgres.
- El jurado abre el web → ve el perfil + matches del lead → puede pegar un contrato y obtener análisis.
- Los 3 agentes son nodos LangGraph en Python, hablan a Claude vía la API de Anthropic.
- LangSmith captura todas las trazas (recuérdalo el domingo para mostrar al jurado: "miren cómo razona el agente").

---

## 4. Setup inicial (primeros 30 minutos)

### 4.1 Pre-requisitos (verifica antes de empezar)
```bash
node -v       # >= 18
python --version   # >= 3.11
docker -v
git --version
```

### 4.2 Telegram bot (5 min)
1. Abre Telegram, busca `@BotFather`.
2. `/newbot` → nombre: `CasaLens MVP` → username: `casalens_mvp_bot` (o el que esté libre).
3. **Copia el token** que te da. Algo como `7234567890:AAH...`. **Guárdalo seguro**, va en `.env`.
4. Opcional: `/setdescription` y `/setuserpic` para que se vea profesional. Mañana lo hacemos.

### 4.3 Crear branch y servicio Python (10 min)
```bash
cd ~/proyectos/unicron   # o donde tengas el repo
git checkout -b casalens-mvp
mkdir -p services/agents/app/{agents,graphs,telegram,api,db,data}
cd services/agents

# Init Python project con uv (más rápido que pip; si no tienes uv, usa pip + venv)
python -m venv .venv
source .venv/bin/activate
pip install --upgrade pip

# Dependencias core
pip install \
  langgraph==0.2.* \
  langchain-anthropic==0.2.* \
  python-telegram-bot==21.* \
  fastapi==0.115.* \
  uvicorn==0.32.* \
  asyncpg==0.30.* \
  pgvector==0.3.* \
  voyageai==0.3.* \
  python-dotenv==1.0.* \
  pydantic==2.* \
  langsmith==0.1.*

pip freeze > requirements.txt
```

### 4.4 Docker Compose tweak (5 min)
Edita `infra/docker/local/docker-compose.yml`:
```yaml
services:
  postgres:
    image: pgvector/pgvector:pg16   # ← antes era postgres:16
    environment:
      POSTGRES_DB: casalens
      POSTGRES_USER: casalens
      POSTGRES_PASSWORD: casalens_dev
    ports:
      - "5432:5432"
    volumes:
      - pg_data:/var/lib/postgresql/data
```

```bash
cd ../../..  # volver al root
npm run infra:down  # parar lo que haya
docker compose -f infra/docker/local/docker-compose.yml up -d postgres redis
docker compose -f infra/docker/local/docker-compose.yml logs postgres   # confirma "ready to accept connections"
```

### 4.5 Variables de entorno (5 min)
Crea `services/agents/.env`:
```env
# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Voyage para embeddings (regístrate en voyageai.com, 200M tokens gratis)
VOYAGE_API_KEY=pa-...

# Telegram
TELEGRAM_BOT_TOKEN=7234567890:AAH...

# Postgres
DATABASE_URL=postgresql://casalens:casalens_dev@localhost:5432/casalens

# LangSmith (ya lo tienes configurado para TFG, reusa)
LANGSMITH_TRACING=true
LANGSMITH_API_KEY=lsv2_...
LANGSMITH_PROJECT=casalens-mvp

# Modelos
LEAD_MODEL=claude-haiku-4-5-20251001
MATCH_MODEL=claude-sonnet-4-6
LEGAL_MODEL=claude-sonnet-4-6
```

> **Atención Odaliz:** ya rotaste tu API key cuando se expuso. Asegúrate de que esta sea una key nueva y que `.env` esté en `.gitignore` (UNICRON ya debería tenerlo). Confirma con `cat .gitignore | grep .env`.

### 4.6 Schema de la base (5 min)
Crea `services/agents/app/db/schema.sql`:
```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    telegram_chat_id BIGINT UNIQUE,
    operation_type TEXT,
    budget_usd NUMERIC,
    zones TEXT[],
    rooms INT,
    timing_weeks INT,
    profile JSONB,
    qualification_score NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS properties (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    operation_type TEXT,
    price_usd NUMERIC,
    zone TEXT,
    rooms INT,
    bathrooms INT,
    area_m2 NUMERIC,
    has_parking BOOLEAN,
    pet_friendly BOOLEAN,
    photo_urls TEXT[],
    embedding vector(1024),
    raw JSONB
);

CREATE INDEX IF NOT EXISTS properties_embedding_idx
    ON properties USING hnsw (embedding vector_cosine_ops);
```

Aplicar:
```bash
docker exec -i $(docker ps -qf "name=postgres") \
  psql -U casalens -d casalens < services/agents/app/db/schema.sql
```

---

## 5. Plan hora por hora (resto del día)

Asumiendo arrancas el setup ~14:00, planificación realista hasta ~23:00.

### 🕐 Bloque 1 (14:30 → 16:30) — Telegram bot + Lead Qualifier mínimo

**Meta:** mandas `/start` a tu bot, te responde, te hace 4 preguntas, guarda el lead en Postgres.

**Pasos:**
1. `app/config.py` — carga `.env` con `python-dotenv`, expone constantes.
2. `app/db/connection.py` — pool asyncpg singleton.
3. `app/graphs/lead_graph.py` — grafo LangGraph con:
   - State: `LeadState(messages, lead_profile, next_question, complete)`
   - Nodo `chat` (Claude Haiku decide qué preguntar)
   - Nodo `extract` (Claude extrae al JSON desde messages)
   - Nodo `persist` (guarda a Postgres cuando `complete=True`)
   - Edges condicionales
4. `app/telegram/bot.py` — `python-telegram-bot` con `MessageHandler` que invoca el grafo usando `chat_id` como `thread_id` para checkpoint.
5. Ejecutar: `python -m app.telegram.bot`.

**System prompt del Lead Qualifier (úsalo tal cual y luego itera):**
```
Sos CasaLens, asistente inmobiliario boliviano. Tu trabajo es entender qué busca esta persona
en 4-6 preguntas naturales, no como formulario. Cochala/paceño/cruceño, usa modismos suaves
cuando encaje. Datos que necesitas extraer:
- operation_type: "alquiler" | "anticretico" | "venta"
- budget_usd: número aproximado (en alquiler es mensual, en anticretico y venta es total)
- zones: lista de zonas o ciudad (ej: ["Recoleta", "Cala Cala"])
- rooms: dormitorios deseados
- timing_weeks: cuán urgente es (en semanas)
- extras: pet_friendly, parking, etc.

Estilo: corto, una pregunta a la vez. Si la persona da info espontánea, no la vuelvas a pedir.
Cuando tengas los 5 campos principales, decí "Perfecto, ya tengo lo que necesito. Te paso unas
propiedades en un momento." y terminás.
```

**Test manual:**
- Manda `/start` → el bot debería saludar y preguntar primera cosa.
- Conversación de 4-6 turnos → al final ves la fila en la tabla `leads`.

**Verificación de éxito del bloque:**
```bash
docker exec -it $(docker ps -qf "name=postgres") \
  psql -U casalens -d casalens -c "SELECT * FROM leads;"
```
Debe mostrar tu lead con el JSON poblado.

---

### 🕓 Bloque 2 (16:30 → 18:30) — Datos sintéticos + embeddings + Matcher básico

**Meta:** 25 propiedades realistas indexadas con embeddings, una función `search_properties(query: str) → list[Property]` que funciona.

**Pasos:**
1. `app/data/synthetic_properties.py` — script que:
   - Llama a Claude Sonnet 4 con un prompt: "genera 25 propiedades realistas de Cochabamba con zonas reales (Recoleta, Cala Cala, Tupuraya, Queru Queru, Sarco, Sur), operation_type variado, descripciones de 2-3 frases con detalles concretos (luminoso, balcón, cocina abierta, mascotas)".
   - Output: JSON con 25 props.
   - Por cada prop, llama a Voyage `voyage-3-lite` para el embedding de `description`.
   - Inserta en Postgres.
2. `app/agents/property_matcher.py`:
   - Función `search_properties(query, lead_profile, k=10)`:
     - Filtro duro SQL: presupuesto ±20%, zonas si las hay, rooms ±1, operation_type exacto.
     - Vector search sobre los que pasaron el filtro: `ORDER BY embedding <=> voyage_embed(query) LIMIT 10`.
   - Función `rerank_with_claude(candidates, lead_profile) → top 5 con razones`:
     - Pasa los 10 candidatos + el perfil a Sonnet 4 y le pide ordenar con razonamiento corto.

**Prompt de re-ranking:**
```
Te paso 10 propiedades candidatas y el perfil de un buscador. Devolveme las top 5 ordenadas
por encaje, con UNA razón corta (máx 12 palabras) por cada una.

Formato JSON estricto:
{
  "ranked": [
    {"property_id": "P-001", "score": 0.92, "reason": "..."},
    ...
  ]
}

Perfil: {LEAD_PROFILE}
Candidatas: {CANDIDATES}
```

**Test manual:**
- Corre el script y pide: "busca depa luminoso 2 dorm para una pareja con perro chico en Recoleta, USD 35.000 anticrético". Debería retornar 5 propiedades coherentes con razones.
- Logueá los resultados, no hace falta UI hoy.

**Verificación:**
```python
# en un REPL Python
from app.agents.property_matcher import search_properties, rerank_with_claude
results = await search_properties("...", lead_profile={...})
top5 = await rerank_with_claude(results, lead_profile={...})
print(top5)
```

---

### 🕕 Bloque 3 (18:30 → 20:30) — Contract Reviewer experimento aislado

**Meta:** función `analyze_contract(text: str) → ContractAnalysis` que detecta 7+ de 10 cláusulas abusivas plantadas.

**Pasos:**
1. `app/data/sample_contracts/` — pegá 2-3 contratos de alquiler/anticrético reales o sintéticos. Generá uno con Claude pidiendo "contrato de alquiler boliviano estándar de 24 meses".
2. **Plantale 10 cláusulas problemáticas** manualmente. Lista mínima:
   1. "El propietario podrá ingresar al inmueble cuando lo considere necesario" (viola privacidad)
   2. "Garantía equivalente a 3 cuotas de alquiler" (excesivo)
   3. Sin mención de inscripción en Derechos Reales (si es anticrético > USD 5.000, crítico)
   4. "El inquilino pagará la comisión de la inmobiliaria" (en muchos lugares es del arrendador)
   5. "Renuncia el inquilino a reclamar reparaciones estructurales" (ilegal)
   6. "Penalización del 50% del valor anual si desiste antes de los 12 meses" (desproporcionada)
   7. "Prohibido recibir visitas que se queden a dormir" (restricción arbitraria)
   8. Ajuste anual sin tope (debería estar limitado a un índice)
   9. Servicios obligatorios (TV cable, internet) que no pidió el inquilino
   10. Cláusula de mascotas con multa de USD 500 si descubren mascota no declarada (excesiva)
3. `app/agents/contract_reviewer.py`:
   - Función `analyze_contract(text) → dict`:
     - Llama a Claude Sonnet 4 con system prompt extenso.
     - Output JSON estructurado: `{red_flags: [...], yellow_flags: [...], green: [...], missing_required: [...]}`.
   - Función `apply_logic_lens(analysis, contract_text) → dict` (la magia de tu TFG):
     - Verificaciones duras escritas en Python sobre `contract_text`:
       - `if "Derechos Reales" not in contract_text and operation_type == "anticretico": add to missing_required`
       - `if regex_matches_garantia > 1_cuota: add to red_flags`
       - `if "ingresar al inmueble" matches without "previo aviso": add to red_flags`
     - Esto **sobrescribe o complementa** lo que dijo Claude. Es tu Logic Lens en miniatura.

**System prompt del Contract Reviewer (template inicial):**
```
Sos un revisor legal especializado en contratos inmobiliarios bolivianos. Tu única tarea
es analizar un contrato y devolver un JSON estricto identificando:

- red_flags: cláusulas ilegales o gravemente abusivas (entrada sin aviso, garantías excesivas,
  renuncia a derechos básicos, falta de registro en Derechos Reales para anticréticos >USD5000,
  comisiones cargadas al inquilino).
- yellow_flags: cláusulas cuestionables o ambiguas que el inquilino debería renegociar.
- green: 3-5 cláusulas que están bien redactadas (para que la persona vea que no es todo malo).
- missing_required: elementos legalmente obligatorios que faltan (ej: inscripción en Derechos
  Reales para anticréticos, mención de plazo, identificación clara de partes).

Por cada item, devolvé: { "clause_id": "C-XX", "text_excerpt": "...", "issue": "...",
"legal_reference": "...", "recommendation": "..." }

Sé conservador: si dudás, marcá como yellow no como red. Cita artículos del Código Civil
boliviano cuando los conozcas (1540 para anticrético/DDRR, 1429 anticresis).

JSON estricto, sin texto adicional. Empezá con { y terminá con }.
```

**Test manual:**
- Corré contra tu contrato plantado → mide cuántos red flags detecta (>= 7 es éxito).
- Corré contra un contrato limpio → no debería marcar red flags falsos.

**Verificación:**
- Comparas a mano el output con tu lista de 10 cláusulas plantadas.
- Si detecta < 7, ajusta el system prompt (probablemente sea cuestión de explicitar más ejemplos).

---

### 🕗 Bloque 4 (20:30 → 22:00) — FastAPI mínimo + integración 1 punta

**Meta:** los 3 agentes están envueltos en FastAPI; podés probar Lead Qualifier por Telegram, Matcher con curl, Contract Reviewer con curl.

**Pasos:**
1. `app/api/main.py`:
   ```python
   from fastapi import FastAPI
   from pydantic import BaseModel
   app = FastAPI(title="CasaLens Agents")

   @app.get("/health")
   async def health(): return {"ok": True}

   @app.get("/leads/{lead_id}")
   async def get_lead(lead_id: str): ...

   @app.get("/leads/{lead_id}/matches")
   async def get_matches(lead_id: str):
       # carga lead → corre matcher → devuelve top 5
       ...

   class ContractIn(BaseModel):
       text: str
       operation_type: str = "alquiler"

   @app.post("/contracts/analyze")
   async def analyze(payload: ContractIn): ...
   ```
2. Correr en otra terminal: `uvicorn app.api.main:app --reload --port 8000`.
3. Probar:
   ```bash
   curl localhost:8000/health
   curl localhost:8000/leads/L-001/matches
   curl -X POST localhost:8000/contracts/analyze \
     -H 'Content-Type: application/json' \
     -d '{"text": "...", "operation_type": "anticretico"}'
   ```

---

### 🕙 Bloque 5 (22:00 → 23:00) — Cierre del día + LangSmith review

**Meta:** validar que todo lo de hoy quedó documentado, las trazas son legibles, y planificás el sábado con calma.

**Pasos:**
1. Abrí LangSmith → proyecto `casalens-mvp` → revisá las trazas del día. Buscá:
   - Latencias raras (alguna llamada > 5s? ver si vale Haiku vs Sonnet).
   - Tokens consumidos (sumá para tener estimación de costo del finde).
2. Commit:
   ```bash
   git add services/agents infra/docker/local/docker-compose.yml
   git commit -m "feat: pre-mvp dia 1 - telegram bot + 3 agentes validados"
   git push origin casalens-mvp
   ```
3. Actualizá `services/agents/README.md` con cómo correr el servicio (lo va a leer alguien del equipo).
4. Anotá en un archivo `NOTES_DIA1.md`:
   - Qué funcionó.
   - Qué falló (system prompts que ajustar).
   - Datos que faltan (más zonas? más cláusulas?).
   - Top 3 cosas para arrancar el sábado a primera hora.

---

## 6. Code skeletons clave

### 6.1 `app/graphs/lead_graph.py` (esqueleto)
```python
from typing import TypedDict, Annotated, Literal
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from langchain_anthropic import ChatAnthropic
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
import json, os

SYSTEM_PROMPT = """..."""  # el de arriba

class LeadState(TypedDict):
    messages: list
    lead_profile: dict
    complete: bool

llm = ChatAnthropic(model=os.getenv("LEAD_MODEL"), temperature=0.3)

async def chat_node(state: LeadState) -> LeadState:
    msgs = [SystemMessage(content=SYSTEM_PROMPT)] + state["messages"]
    response = await llm.ainvoke(msgs)
    return {"messages": state["messages"] + [response]}

async def extract_node(state: LeadState) -> LeadState:
    # le pide a Claude que devuelva el JSON del perfil basado en la conversación
    extraction_prompt = f"""De la conversación siguiente, extraé el perfil JSON con campos:
    operation_type, budget_usd, zones, rooms, timing_weeks, extras.
    Si algún campo no fue mencionado, ponelo en null.
    JSON estricto.

    Conversación: {state['messages']}"""
    resp = await llm.ainvoke([HumanMessage(content=extraction_prompt)])
    try:
        profile = json.loads(resp.content)
    except Exception:
        profile = state.get("lead_profile", {})
    complete = all(profile.get(k) for k in ["operation_type", "budget_usd", "zones", "rooms"])
    return {"lead_profile": profile, "complete": complete}

def should_continue(state: LeadState) -> Literal["extract", END]:
    # despues de cada turno del bot, intentamos extraer
    return "extract"

def after_extract(state: LeadState) -> Literal["__end__", "chat"]:
    return "__end__" if state["complete"] else "chat"

graph = StateGraph(LeadState)
graph.add_node("chat", chat_node)
graph.add_node("extract", extract_node)
graph.set_entry_point("chat")
graph.add_edge("chat", "extract")
graph.add_conditional_edges("extract", after_extract, {"chat": "chat", "__end__": END})

lead_graph = graph.compile(checkpointer=MemorySaver())
```

### 6.2 `app/telegram/bot.py` (esqueleto)
```python
import os
from telegram import Update
from telegram.ext import Application, MessageHandler, CommandHandler, filters, ContextTypes
from langchain_core.messages import HumanMessage
from app.graphs.lead_graph import lead_graph
from app.db.connection import save_lead

async def start(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "¡Hola! Soy CasaLens. Te ayudo a encontrar tu próxima casa o depa en Bolivia. "
        "Contame, ¿estás buscando alquiler, anticrético o querés comprar?"
    )

async def on_message(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    chat_id = update.effective_chat.id
    text = update.message.text

    config = {"configurable": {"thread_id": str(chat_id)}}
    state = await lead_graph.ainvoke(
        {"messages": [HumanMessage(content=text)], "lead_profile": {}, "complete": False},
        config=config,
    )

    last_msg = state["messages"][-1]
    await update.message.reply_text(last_msg.content)

    if state["complete"]:
        await save_lead(chat_id=chat_id, profile=state["lead_profile"])
        await update.message.reply_text(
            "Listo, ya tengo tu perfil. Mirá tus matches acá: "
            f"http://localhost:5173/app/matcher?lead={chat_id}"
        )

def main():
    app = Application.builder().token(os.getenv("TELEGRAM_BOT_TOKEN")).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, on_message))
    app.run_polling()

if __name__ == "__main__":
    main()
```

### 6.3 Generador de propiedades (`app/data/synthetic_properties.py`)
```python
import asyncio, json, os, uuid
from langchain_anthropic import ChatAnthropic
import voyageai
from app.db.connection import get_pool

PROMPT = """Generá 25 propiedades inmobiliarias realistas de Cochabamba, Bolivia, en JSON.
Cada una con: id (P-001..P-025), title, description (2-3 frases con detalles concretos: luminoso,
balcón, cocina abierta, vista, ascensor, parking, pet-friendly, etc), operation_type
(alquiler|anticretico|venta), price_usd (rangos realistas: alquiler 200-1200/mes, anticrético
15000-80000, venta 50000-300000), zone (mezclá: Recoleta, Cala Cala, Tupuraya, Queru Queru,
Sarco, Sur, Aranjuez, Cochabamba centro), rooms (1-4), bathrooms (1-3), area_m2 (40-200),
has_parking (bool), pet_friendly (bool).

JSON estricto: {"properties": [...]}"""

async def main():
    llm = ChatAnthropic(model="claude-sonnet-4-6", temperature=0.7, max_tokens=4096)
    voyage = voyageai.AsyncClient(api_key=os.getenv("VOYAGE_API_KEY"))

    resp = await llm.ainvoke(PROMPT)
    data = json.loads(resp.content)
    props = data["properties"]

    # embeddings
    descriptions = [p["description"] for p in props]
    embed_resp = await voyage.embed(descriptions, model="voyage-3-lite", input_type="document")
    embeddings = embed_resp.embeddings

    pool = await get_pool()
    async with pool.acquire() as conn:
        for p, emb in zip(props, embeddings):
            await conn.execute(
                """INSERT INTO properties (id, title, description, operation_type, price_usd,
                   zone, rooms, bathrooms, area_m2, has_parking, pet_friendly, embedding, raw)
                   VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
                   ON CONFLICT (id) DO NOTHING""",
                p["id"], p["title"], p["description"], p["operation_type"], p["price_usd"],
                p["zone"], p["rooms"], p["bathrooms"], p["area_m2"], p["has_parking"],
                p["pet_friendly"], emb, json.dumps(p),
            )
    print(f"Inserted {len(props)} properties.")

if __name__ == "__main__":
    asyncio.run(main())
```

---

## 7. Comandos del día (cheat sheet)

```bash
# Levantar infra
docker compose -f infra/docker/local/docker-compose.yml up -d postgres redis

# En terminal 1: bot Telegram
cd services/agents && source .venv/bin/activate
python -m app.telegram.bot

# En terminal 2: FastAPI (cuando llegues al bloque 4)
cd services/agents && source .venv/bin/activate
uvicorn app.api.main:app --reload --port 8000

# En terminal 3: ejecutar scripts puntuales
cd services/agents && source .venv/bin/activate
python -m app.data.synthetic_properties

# Ver tabla
docker exec -it $(docker ps -qf "name=postgres") \
  psql -U casalens -d casalens -c "SELECT id, operation_type, profile FROM leads;"

# Ver embeddings se cargaron
docker exec -it $(docker ps -qf "name=postgres") \
  psql -U casalens -d casalens -c "SELECT id, title, zone FROM properties LIMIT 5;"
```

---

## 8. Métricas de éxito del día

Al final del día, deberías poder decir SÍ a estas:

- [ ] Mandé `/start` al bot de Telegram, conversé 5 turnos, terminó con "ya tengo lo que necesito".
- [ ] Hay una fila en la tabla `leads` con el perfil JSON poblado por mi conversación.
- [ ] Hay 25 propiedades en la tabla `properties` con embeddings (1024 dim).
- [ ] Llamé a `search_properties("anticretico Recoleta 2 dorm pet friendly")` desde Python y me devolvió 5 propiedades con razones explicables.
- [ ] Pasé un contrato con 10 cláusulas plantadas al Contract Reviewer y detectó al menos 7.
- [ ] FastAPI levanta en :8000 y responde a `/health`, `/leads/{id}/matches`, `/contracts/analyze`.
- [ ] LangSmith tiene trazas etiquetadas en proyecto `casalens-mvp`.
- [ ] Commit limpio en branch `casalens-mvp` con README actualizado.

Si pasás 6 de 8, el día fue excelente. Si pasás 4-5, sigue siendo buena base para el sábado.

---

## 9. Lo que dejamos para mañana (preview sábado 16/05)

Para que no te angusties hoy queriendo terminar todo:

**Sábado AM (9:00 - 13:00):**
- Refinamiento de system prompts según trazas LangSmith.
- Generar 30 propiedades reales (scrapeando UltraCasas/InfoCasas legalmente para tener fotos reales).
- Logic Lens más completo (reglas Python sobre Knowledge Graph mini).

**Sábado PM (13:00 - 24:00):**
- Web dashboard:
  - `apps/web/src/modules/matcher/` — página que carga `/leads/{id}/matches` y muestra cards bonitas
  - `apps/web/src/modules/contracts/` — textarea + botón "Analizar" → muestra resultado del Contract Reviewer
  - Estilo dark navy/gold (reusás el aesthetic de Magnos's Builders, encaja perfecto)
- Integrar Telegram → al completar el lead, mandar link con `lead_id` que abre el matcher.

**Domingo AM (00:00 - 09:00):** sleep window de 3-4 horas + pulido + pitch.

**Domingo (9:00 - 11:00):** ensayar pitch, demo de respaldo grabado, presentación.

---

## 10. Reglas para no morirse hoy

1. **No optimicemos antes de funcionar.** Hardcodea, mockea, vuelve después. Cada vez que pienses "esto debería ser configurable", anótalo y sigue.
2. **Si un experimento tarda >3 horas, simplificá el alcance.** Mejor 3 cosas a 70% que 1 a 100%.
3. **Logueá todo a `print` por ahora.** Logger formal el sábado.
4. **Commit cada hora.** Aunque sea WIP. Si el laptop se cuelga, no perdés.
5. **Si Claude rate-limitea**, tenés 3 cuentas potenciales: la tuya personal, la del equipo, la de tu agencia. Rotalas como API keys distintas.
6. **No toques `apps/api` hoy.** Es trampa de tiempo. El sábado decidimos si lo usamos.
7. **Si algo del UNICRON repo está rompiéndote, salta a `services/agents` directo.** No pelees con la tubería, hoy.

Vamos. Empezás con el setup de los primeros 30 min. Cuando termines, decime y revisamos juntos el Bloque 1.

— Houston
