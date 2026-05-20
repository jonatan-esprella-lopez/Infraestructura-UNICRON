<<<<<<< HEAD
# INTERSIM PropTech

**INTERSIM PropTech** es una plataforma integral de gestión inmobiliaria de próxima generación. Diseñada para unificar todo el ciclo de vida de los bienes raíces, conecta a compradores, propietarios, agentes y administradores en un ecosistema centralizado, impulsado por Inteligencia Artificial y herramientas financieras avanzadas.

---

## 🎯 Visión del Proyecto
Transformar el mercado inmobiliario mediante la digitalización, la automatización y la transparencia. Buscamos eliminar la fricción en la compra, venta y alquiler de propiedades, dotando a los agentes de herramientas profesionales (CRM, IA, Avalúos) y empoderando a los clientes con información clara y simuladores financieros precisos.

---

## 👥 Usuarios y Roles
La plataforma está diseñada con una arquitectura multi-rol, ofreciendo tableros personalizados para cada tipo de usuario:

1. **Cliente / Comprador:**
   - Búsqueda pública de propiedades.
   - Centro Financiero (simuladores de hipoteca, accesibilidad, alquiler vs compra).
   - Programación de visitas y gestión de perfil.

2. **Propietario:**
   - Panel de control de sus inmuebles.
   - Herramientas de avalúo automático para estimar precios de mercado.
   - Marketplace de agentes para contratar profesionales calificados.
   - Visibilidad de métricas e interacciones de sus propiedades.

3. **Agente Inmobiliario:**
   - **CRM Completo:** Gestión de Leads, Clientes, Visitas y Embudo de Ventas.
   - **Matching IA:** Inteligencia artificial que cruza automáticamente las preferencias de los leads con el inventario disponible.
   - **Avalúos & Contratos:** Generación de contratos automatizados y tasación inteligente.
   - **Centro Financiero:** Calificación financiera de prospectos en tiempo real.

4. **Administrador de Agencia / Sistema (Admin):**
   - Gestión integral de usuarios, roles y permisos.
   - Analytics avanzados, reportes de ventas y desempeño del mercado.
   - Configuración de flujos de trabajo (Workflows) y Campañas.

---

## 🚀 Módulos Principales (Features)

*   **Centro Financiero PropTech:** Simuladores desvinculados de la UI (SOLID) para Hipotecas, Accesibilidad de Compra y comparativa Alquiler vs. Compra.
*   **Matching Inteligente (IA):** Algoritmos que conectan clientes con su propiedad ideal basándose en presupuesto, zona y necesidades.
*   **Gestor de Avalúos:** Herramienta para agentes y propietarios que estima el valor comercial usando características del inmueble y comparables del mercado.
*   **CRM Inmobiliario:** Pipeline de ventas, seguimiento de contactos (Leads/Clientes) y calendario de visitas.
*   **Gestión Documental y Legal:** Creación y seguimiento de contratos (Compraventa, Alquiler, Anticrético) con validación integrada.
*   **Panel Administrativo:** Dashboards con reportes, analytics, campañas y control total del ecosistema.

---

## 🧩 Arquitectura y Stack Tecnológico

El proyecto está construido bajo una arquitectura modular y escalable, priorizando la separación de responsabilidades y el rendimiento:

*   **Frontend:** React + TypeScript + Vite.
*   **Estilos:** BEM (Block Element Modifier) con CSS puro para máximo rendimiento y predictibilidad. Sin frameworks bloqueantes.
*   **Arquitectura Frontend:** Patrón de Módulos (Feature-Sliced Design simplificado), separando `components`, `hooks`, `services` y `types` por cada funcionalidad.
*   **Backend / Base de Datos:** Entorno escalable preparado para integrarse con bases de datos relacionales (Turso / SQLite) usando schemas fuertemente tipados.
*   **Principios:** Aplicación rigurosa de SOLID, con lógica de negocio encapsulada en la capa de servicios (`.service.ts`), desvinculada de la interfaz gráfica.

---

## 🛠️ Problemáticas que Resuelve

1. **Desconexión del Mercado:** Tradicionalmente, clientes, propietarios y agentes usan plataformas distintas (WhatsApp, Excel, portales básicos). *INTERSIM centraliza todo en un solo lugar.*
2. **Falta de Certeza Financiera:** Los compradores a menudo no saben qué pueden pagar. *El Centro Financiero empodera y pre-califica al instante.*
3. **Pérdida de Tiempo en Búsquedas:** *El Matching IA reduce horas de búsqueda manual recomendando propiedades exactas.*
4. **Falta de Transparencia en Precios:** *Los Avalúos Automáticos estandarizan precios para evitar la especulación y acelerar las ventas.*

---

## 💻 Instalación y Uso Local

1. Clona el repositorio.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo del Frontend:
   ```bash
   npm run dev
   ```
4. Navega a `http://localhost:5173`. Para acceder a los módulos de prueba, usa las rutas del dashboard (`/app/proptech`), el portal financiero (`/finanzas`) o el landing público (`/`).
=======
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
>>>>>>> origin/exp/pres
