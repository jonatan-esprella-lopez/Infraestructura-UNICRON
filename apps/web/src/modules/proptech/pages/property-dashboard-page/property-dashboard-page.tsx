import './property-dashboard-page.css';

const STATS = [
  { label: 'Propiedades activas', value: '—', key: 'active' },
  { label: 'Visitas agendadas', value: '—', key: 'visits' },
  { label: 'Matches generados', value: '—', key: 'matches' },
  { label: 'Contratos en revisión', value: '—', key: 'contracts' },
];

const QUICK_LINKS = [
  { label: 'Nueva propiedad', href: '/app/proptech/properties/new' },
  { label: 'Ejecutar matching', href: '/app/proptech/matching' },
  { label: 'Revisar contrato', href: '/app/proptech/contracts' },
  { label: 'Ver catálogo', href: '/app/proptech/properties' },
];

export function PropertyDashboardPage() {
  return (
    <section className="property-dashboard-page">
      <div className="property-dashboard-page__header">
        <p className="property-dashboard-page__eyebrow">Proptech — INTERSIM</p>
        <h2 className="property-dashboard-page__title">Panel inmobiliario</h2>
        <p className="property-dashboard-page__description">
          Gestión completa de propiedades, clientes, visitas, matching IA y contratos.
        </p>
      </div>

      <div className="property-dashboard-page__stats">
        {STATS.map((stat) => (
          <div key={stat.key} className="property-dashboard-stat">
            <span className="property-dashboard-stat__value">{stat.value}</span>
            <span className="property-dashboard-stat__label">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="property-dashboard-page__links">
        <h3>Accesos rápidos</h3>
        <div className="property-dashboard-page__links-grid">
          {QUICK_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="property-dashboard-link">
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div className="property-dashboard-page__flow">
        <h3>Flujo inmobiliario</h3>
        <ol className="property-flow">
          {[
            'Registrar propietario',
            'Registrar inmueble',
            'Cargar fotos y documentos',
            'Generar descripción con IA',
            'Publicar inmueble',
            'Capturar interesados',
            'Hacer matching IA',
            'Agendar visita',
            'Crear oferta',
            'Revisar contrato con IA',
            'Cerrar operación',
          ].map((step, i) => (
            <li key={i} className="property-flow__step">{step}</li>
          ))}
        </ol>
      </div>
    </section>
  );
}
