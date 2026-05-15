# Conventions

- Imports internos usan aliases: `@core/*`, `@shared/*`, `@modules/*`, `@services/*`.
- Cada modulo expone barrel export con `index.ts`.
- Cada archivo conserva una responsabilidad clara.
- Las rutas de negocio se cargan con `React.lazy`.
