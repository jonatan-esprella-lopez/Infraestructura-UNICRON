# UNICRON / WASI PropTech

Monorepo para la plataforma PropTech: frontend React/Vite, API Node/TypeScript, servicio Python de agentes y configuracion de infraestructura.

## Servicios desplegados

- Frontend: `https://wasi.pages.dev`
- Backend API: `https://infraestructura-unicron-api.vercel.app`
- Agents API: `https://casalens-agents-production.up.railway.app`

## Estructura

```plaintext
apps/
  web/
  api/
packages/
  config/
  types/
  utils/
services/
  agents/
infra/
tools/
```

## Desarrollo local

```bash
npm install
npm run dev:web
npm run dev:api
```

Frontend local: `http://localhost:5173`.
Backend local: `http://localhost:4000`.

## Infra local

```bash
npm run infra:up
```

Levanta web, api, postgres, redis, nginx, prometheus, grafana y loki.

## Checks

```bash
npm run typecheck:all
npm run build:all
npm run test:api
```
