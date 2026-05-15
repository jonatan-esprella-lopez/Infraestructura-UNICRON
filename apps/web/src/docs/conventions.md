# Conventions

- Imports internos usan aliases: `@core/*`, `@shared/*`, `@modules/*`, `@services/*`.
- Cada modulo expone barrel export con `index.ts`.
- Cada archivo conserva una responsabilidad clara.
- Las rutas de negocio se cargan con `React.lazy`.
- El CSS global entra solo por `@styles/index.css`.
- Los componentes importan su propio CSS y usan BEM con tokens.
- Los valores visuales directos viven en `styles/tokens` o `styles/themes`, no en componentes.
