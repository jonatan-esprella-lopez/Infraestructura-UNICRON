# Unicron API

Backend scaffold for a Clean Architecture + Modular Monolith + DDD + Event Driven API.

## What is included

- Bootstrap lifecycle for app, routes, middlewares, database, cache, queue, events, websocket, and scheduler.
- Core contracts for config, errors, route handlers, domain events, repositories, use cases, and providers.
- Infrastructure adapters for in-memory cache, queue, metrics, health checks, storage, mail, logging, and AI provider placeholders.
- Enterprise module map: auth, users, roles, permissions, tenants, dashboard, analytics, CRM, campaigns, notifications, documents, scoring, wallets, QR, geolocation, AI assistant, and settings.
- CRM implemented as the reference module with domain, application, infrastructure, presentation, and event publishing layers.
- Event-driven Quantum flow: CRM -> Scoring -> AI Assistant -> Campaigns -> Notifications -> Analytics.
- Event-driven VIVA flow: QR -> Campaigns -> Wallets -> Notifications -> Analytics.

## Commands

```bash
npm run typecheck:api
npm run build:api
npm run start:api
```

## Health and observability

```plaintext
GET /health
GET /metrics
GET /ready
GET /live
```

Module routes are exposed under `/api/v1`.
