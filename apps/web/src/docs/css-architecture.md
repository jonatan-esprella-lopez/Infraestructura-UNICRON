# CSS Architecture

La app usa BEM + design tokens + layered CSS + component isolation.

## Capas globales

`src/styles/index.css` es el unico CSS global importado desde `main.tsx`.

Orden:

1. `core`: reset, normalize, base, typography y accessibility.
2. `tokens`: colors, spacing, typography, shadows, radius, sizes, z-index, transitions y breakpoints.
3. `themes`: light, dark, corporate y hackathon.
4. `utilities`: helpers pequenos para display, flex, grid, spacing, text, visibility y responsive.
5. `animations`: fade, slide, scale y loading.
6. `layouts`: auth, dashboard y landing layout.
7. `globals`: estados globales como `is-loading`, `is-error` e `is-active`.

## Component isolation

Cada componente compartido mantiene su CSS junto al TSX:

```plaintext
shared/components/ui/button/
├── Button.tsx
├── Button.css
├── Button.types.ts
├── button.variant.ts
└── index.ts
```

El componente importa su propio CSS. No se agregan estilos de componentes en `globals.css`.

## BEM

Los bloques deben tener namespace estable:

- Shared UI: `btn`, `ui-badge`, `form-input`, `data-table`.
- Layouts: `dashboard-layout__sidebar`, `dashboard-layout__nav-link`.
- Modulos: `crm-page`, `crm-lead-card`, `crm-pipeline-board`.

Estados globales usan `is-*`:

- `is-active`
- `is-loading`
- `is-error`

## Tokens

Evitar valores directos fuera de `tokens` y `themes`.

Correcto:

```css
.crm-lead-card {
  padding: var(--space-3);
  border-radius: var(--radius-xs);
  background: var(--color-surface-muted);
}
```

Incorrecto:

```css
.crm-lead-card {
  padding: 12px;
  border-radius: 6px;
  background: #eef2f7;
}
```

## Variants

Las variantes no se escriben a mano en cada render. Usar mapas tipados:

```ts
buttonVariants[variant]
```

Esto evita strings duplicados y hace que TypeScript proteja los modificadores.
