import { useProptechDashboard } from '../../../shared/hooks/use-proptech-dashboard';
import type { AdminDashboard } from '../../../shared/hooks/use-proptech-dashboard';
import './admin-dashboard-page.css';

interface KpiCard {
  label: string;
  key: keyof AdminDashboard;
  suffix?: string;
  highlight?: boolean;
}

const KPI_CARDS: KpiCard[] = [
  { label: 'Propiedades publicadas', key: 'publishedProperties', highlight: true },
  { label: 'Propiedades totales', key: 'totalProperties' },
  { label: 'Pendientes de revisión', key: 'pendingProperties' },
  { label: 'Leads activos', key: 'totalLeads', highlight: true },
  { label: 'Visitas agendadas', key: 'scheduledVisits' },
  { label: 'Visitas totales', key: 'totalVisits' },
  { label: 'Ofertas recibidas', key: 'totalOffers' },
  { label: 'Contratos en revisión', key: 'contractsInReview' },
  { label: 'Documentos pendientes', key: 'documentsPending' },
  { label: 'Agentes activos', key: 'activeAgents' },
  { label: 'Tasa de conversión', key: 'conversionRate', suffix: '%' },
];

const QUICK_ACTIONS = [
  { label: '+ Nueva propiedad', href: '/app/proptech/properties' },
  { label: 'Ver leads', href: '/app/proptech/leads' },
  { label: 'Revisar documentos', href: '/app/proptech/contracts' },
  { label: 'Matching IA', href: '/app/proptech/matching' },
  { label: 'Ver analítica', href: '/app/proptech/analytics' },
];

export function AdminDashboardPage() {
  const { data, loading, error } = useProptechDashboard();
  const kpis = data as AdminDashboard | null;

  return (
    <section className="admin-dashboard">
      <div className="admin-dashboard__header">
        <div>
          <p className="admin-dashboard__eyebrow">Panel de administración</p>
          <h2 className="admin-dashboard__title">Dashboard inmobiliario</h2>
        </div>
        <div className="admin-dashboard__actions">
          {QUICK_ACTIONS.map((a) => (
            <a key={a.href} href={a.href} className="admin-dashboard__action-btn">{a.label}</a>
          ))}
        </div>
      </div>

      {loading && <p className="admin-dashboard__loading">Cargando indicadores...</p>}
      {error && <p className="admin-dashboard__error">No se pudo cargar el dashboard: {error}</p>}

      {kpis && (
        <div className="admin-dashboard__kpis">
          {KPI_CARDS.map(({ label, key, suffix, highlight }) => (
            <div key={key} className={`admin-kpi${highlight ? ' admin-kpi--highlight' : ''}`}>
              <span className="admin-kpi__value">
                {kpis[key] ?? '—'}{suffix ?? ''}
              </span>
              <span className="admin-kpi__label">{label}</span>
            </div>
          ))}
        </div>
      )}

      <div className="admin-dashboard__sections">
        <div className="admin-dashboard__section">
          <h3>Flujo inmobiliario activo</h3>
          <ol className="proptech-flow">
            {[
              ['Registrar propietario', 'users'],
              ['Registrar inmueble', 'properties'],
              ['Cargar documentos', 'contracts'],
              ['Publicar inmueble', 'properties'],
              ['Capturar interesados', 'leads'],
              ['Matching IA', 'matching'],
              ['Agendar visita', 'visits'],
              ['Revisar contrato con IA', 'contracts'],
              ['Cerrar operación', 'analytics'],
            ].map(([step, path], i) => (
              <li key={i} className="proptech-flow__step">
                <a href={`/app/proptech/${path}`}>{step}</a>
              </li>
            ))}
          </ol>
        </div>

        <div className="admin-dashboard__section">
          <h3>Permisos y roles</h3>
          <div className="admin-role-grid">
            {[
              { role: 'Administrador', access: 'Control total del sistema' },
              { role: 'Agente', access: 'Propiedades, leads, visitas, tareas' },
              { role: 'Propietario', access: 'Sus inmuebles, visitas y ofertas' },
              { role: 'Cliente', access: 'Búsqueda, recomendaciones y visitas' },
              { role: 'Revisor legal', access: 'Contratos y documentos' },
            ].map((item) => (
              <div key={item.role} className="admin-role-card">
                <strong>{item.role}</strong>
                <span>{item.access}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
