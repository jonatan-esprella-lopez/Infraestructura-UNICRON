# Hackathon Base

Monorepo enterprise para hackathons, MVPs y pilotos SaaS.

## Estructura

```plaintext
apps/
  web/
  api/
packages/
  ui/
  types/
  config/
  utils/
  core/
  ai/
infra/
tools/
```

## Desarrollo

```bash
npm run dev:web
npm run start:api
```

## Demo local con infraestructura

```bash
npm run infra:up
```

Levanta web, api, postgres, redis, nginx, prometheus, grafana y loki.

## Herramientas internas

```bash
npm run generate:module -- crm
npm run validate:architecture
npm run typecheck:all
npm run build:all
```
