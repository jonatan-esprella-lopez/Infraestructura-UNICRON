# Frontend Architecture

La app sigue una arquitectura feature-driven y domain-driven.

- `bootstrap`: inicializacion, providers, entorno e inyeccion de dependencias.
- `core`: contratos globales, constantes, tipos, enums y configuracion.
- `shared`: componentes, hooks, utilidades, validadores y schemas reutilizables.
- `services`: integraciones transversales como API, auth, storage, analytics, notifications y AI.
- `modules`: dominios de negocio aislados con pages, components, hooks, services, repositories, store, schemas, types, constants, routes e index.
