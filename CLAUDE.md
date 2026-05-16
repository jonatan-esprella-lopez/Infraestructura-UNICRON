# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Enterprise monorepo (npm workspaces) for SaaS hackathons and MVPs — branded **UNICRON**. Two apps (`@unicron/api`, `@unicron/web`) plus shared packages. The API is a zero-framework custom HTTP server (no Express/Fastify); the web is React + Vite.

## Commands

### Development

```bash
npm run dev:api          # Watch-compile API (TypeScript → dist/)
npm run start:api        # Run compiled API (requires build first)
npm run dev:web          # Vite dev server for web (port 5173)
npm run infra:up         # Docker Compose: api, web, postgres, redis, nginx, prometheus, grafana, loki
npm run infra:down       # Stop all infra containers
```

### Build & Type-check

```bash
npm run build:api        # Compile API
npm run build:web        # tsc + vite build for web
npm run typecheck:all    # Type-check every workspace
npm run build:all        # Build every workspace
npm run lint:all         # Lint every workspace
```

### Architecture Validators

```bash
npm run validate:architecture   # Runs all four validators below
npm run validate:structure      # File/folder structure
npm run validate:naming         # Naming conventions
npm run validate:imports        # Import rules
npm run validate:dependencies   # Cross-workspace dependency rules
```

### Generators

```bash
npm run generate:module -- <name>         # Generate API + web module scaffolding
npm run generate:api-module -- <name>     # API module only
npm run generate:web-module -- <name>     # Web module only
npm run generate:component -- <name>      # React component
npm run generate:page -- <module> <page>  # React page inside a module
```

### Docs & Health

```bash
npm run docs:swagger        # Generate Swagger docs
npm run docs:architecture   # Architecture diagram
npm run docs:changelog      # Changelog
npm run healthcheck:local   # Check local services are up
npm run release:check       # Pre-release validation
```

## API Architecture (`apps/api`)

**Custom HTTP server** — no web framework. Built on `node:http` with a hand-rolled middleware chain and route matcher.

Key files:
- `src/app.ts` — `ApiApplication`: registers middlewares and routes, dispatches requests, matches paths (`:param` segments), handles errors
- `src/server.ts` — wraps `ApiApplication` in a `node:http` server with `listen`/`close`
- `src/main.ts` — entry point; calls `bootstrapApp()` and handles SIGTERM/SIGINT
- `src/bootstrap/bootstrap-app.ts` — composes all services (`AppServices`) and wires them together
- `src/core/types/api.types.ts` — **central type file**: `AppServices`, `RequestContext`, `RouteDefinition`, `ApplicationModule`, `DomainEvent`, all service interfaces

### Service interfaces (from `AppServices`)

All infrastructure dependencies are injected via `AppServices` and accessed through `context.services` in route handlers. Key interfaces: `DatabaseLike`, `CacheLike`, `QueueLike`, `EventBusLike`, `AiProviderLike`, `MailLike`, `StorageLike`, `MetricsLike`, `LoggerLike`.

### Middleware chain (in order)

`requestId` → `security` → `cors` → `rateLimit` → `requestLogger`

### Module pattern

Each feature module is a function that returns `ApplicationModule` (`{ name, basePath, routes, listeners }`). Use `createFeatureModule()` from `src/modules/_shared/feature-module.factory.ts` as the base — it auto-generates a `GET /basePath` capability listing and `GET /basePath/status` endpoint. Add domain routes in the `routes` array.

Modules are registered in `src/modules/index.ts` and wired in `bootstrap-routes.ts`, which also subscribes module event listeners to the `EventBus`.

### Event system

In-process event bus (`EventEmitter`-backed) in `src/events/event-bus.ts`. Use `createDomainEvent(name, payload, metadata)` to build events; modules subscribe via `listeners` in their `ApplicationModule` definition.

### Routes

All feature routes are prefixed with `API_PREFIX` (default `/api/v1`). Health/readiness routes (`/live`, `/ready`, `/health`, `/metrics`) are unprefixed.

## Web Architecture (`apps/web`)

React 18 + Vite + TypeScript. Path aliases resolve `@routes`, `@layouts`, `@modules`, `@shared`, `@bootstrap`, `@styles`.

- `src/main.tsx` — mounts app, calls `initializeServices()` before render
- `src/App.tsx` → `AppRoutes` — top-level routing
- `src/routes/index.tsx` — route tree: `/` → dashboard, `login` under `AuthLayout`, `app/*` under `DashboardLayout` with `ProtectedRoute` (RBAC-aware)
- `src/routes/lazy.routes.ts` — feature routes loaded lazily; each entry can carry `featureFlag`, `permissions`, and `roles`
- Modules live under `src/modules/<name>/` (pages, components, hooks, services)

## Infra (`infra/`)

Docker Compose stack at `infra/docker/local/docker-compose.yml`. Services: `api` (4000), `web` (5173), `nginx` (8080), `postgres`, `redis`, `prometheus`, `grafana`, `loki`. Environment sourced from `infra/docker/local/.env`.

Kubernetes manifests, monitoring config, and nginx config are in `infra/kubernetes/`, `infra/monitoring/`, and `infra/nginx/`.

## Shared Packages (`packages/`)

| Package | Purpose |
|---|---|
| `@unicron/core` | Domain primitives shared across apps |
| `@unicron/types` | Shared TypeScript types |
| `@unicron/config` | Shared configuration utilities |
| `@unicron/ui` | React component library |
| `@unicron/utils` | Pure utility functions |
| `@unicron/ai` | AI helpers/wrappers |

## Tools (`tools/`)

Internal monorepo tooling only — no runtime business logic.

- `tools/generators/` — scaffold new modules, components, pages from templates
- `tools/validators/` — enforce structure, naming, import, and dependency rules
- `tools/automation/` — typecheck-all, build-all, lint-all, clean-cache, release scripts
- `tools/docs/` — swagger, architecture diagram, changelog generators
- `tools/scripts/` — healthcheck and other one-off scripts
