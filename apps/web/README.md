# UNICRON Web

Frontend enterprise feature-driven, domain-driven y escalable para adaptar rapidamente el mismo producto a CRM, Growth Platform, Fintech, Proptech, Content Creator Platform o Automation SaaS.

## Scripts

- `npm run dev --workspace @unicron/web`
- `npm run build --workspace @unicron/web`
- `npm run typecheck --workspace @unicron/web`

## Arquitectura

La app vive en `src/modules` por dominio. Cada modulo conserva pages, components, hooks, services, repositories, store, schemas, types, constants, routes e `index.ts`.

Los modulos se activan con feature flags `VITE_*_ENABLED`, se cargan por lazy loading y se protegen con permisos desde `src/routes`.

## CSS

El CSS usa BEM, design tokens, themes, utilities minimas y estilos aislados por componente. El orden global esta centralizado en `src/styles/index.css`; la guia esta en `src/docs/css-architecture.md`.
