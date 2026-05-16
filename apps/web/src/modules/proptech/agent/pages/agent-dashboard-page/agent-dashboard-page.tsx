import { useProptechDashboard } from '../../../shared/hooks/use-proptech-dashboard';
import type { AgentDashboard } from '../../../shared/hooks/use-proptech-dashboard';
import './agent-dashboard-page.css';

const URGENT_INDICATORS = [
  { key: 'todayVisits' as keyof AgentDashboard, label: 'Visitas hoy', urgent: true },
  { key: 'followUpsToday' as keyof AgentDashboard, label: 'Seguimientos hoy', urgent: true },
  { key: 'hotClients' as keyof AgentDashboard, label: 'Clientes calientes', urgent: false },
];

const PIPELINE_INDICATORS = [
  { key: 'newLeads' as keyof AgentDashboard, label: 'Leads nuevos' },
  { key: 'assignedProperties' as keyof AgentDashboard, label: 'Propiedades asignadas' },
  { key: 'activeOffers' as keyof AgentDashboard, label: 'Ofertas activas' },
  { key: 'contractsPending' as keyof AgentDashboard, label: 'Contratos pendientes' },
  { key: 'pendingTasks' as keyof AgentDashboard, label: 'Tareas pendientes' },
];

export function AgentDashboardPage() {
  const { data, loading, error } = useProptechDashboard();
  const kpis = data as AgentDashboard | null;

  return (
    <section className="agent-dashboard">
      <div className="agent-dashboard__header">
        <p className="agent-dashboard__eyebrow">Portal del agente inmobiliario</p>
        <h2 className="agent-dashboard__title">Mi panel de trabajo</h2>
      </div>

      {loading && <p className="agent-dashboard__loading">Cargando tu panel...</p>}
      {error && <p className="agent-dashboard__error">{error}</p>}

      {kpis && (
        <>
          <div className="agent-dashboard__urgent">
            <h3 className="agent-dashboard__section-title">Para hoy</h3>
            <div className="agent-dashboard__urgent-grid">
              {URGENT_INDICATORS.map(({ key, label, urgent }) => (
                <div key={key} className={`agent-kpi${urgent ? ' agent-kpi--urgent' : ''}`}>
                  <span className="agent-kpi__value">{kpis[key] ?? 0}</span>
                  <span className="agent-kpi__label">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="agent-dashboard__pipeline">
            <h3 className="agent-dashboard__section-title">Pipeline</h3>
            <div className="agent-dashboard__pipeline-grid">
              {PIPELINE_INDICATORS.map(({ key, label }) => (
                <div key={key} className="agent-pipeline-item">
                  <span className="agent-pipeline-item__value">{kpis[key] ?? 0}</span>
                  <span className="agent-pipeline-item__label">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="agent-dashboard__links">
        <h3 className="agent-dashboard__section-title">Accesos rápidos</h3>
        <div className="agent-dashboard__quick-links">
          {[
            { label: 'Ver mis leads', href: '/app/proptech/leads' },
            { label: 'Ver mis visitas', href: '/app/proptech/visits' },
            { label: 'Ejecutar Matching IA', href: '/app/proptech/matching' },
            { label: 'Mis propiedades', href: '/app/proptech/properties' },
            { label: 'Contratos', href: '/app/proptech/contracts' },
          ].map((link) => (
            <a key={link.href} href={link.href} className="agent-quick-link">{link.label}</a>
          ))}
        </div>
      </div>

      <div className="agent-dashboard__tip">
        <p>
          <strong>Tip del sistema:</strong> Usa el Matching IA para encontrar las propiedades más compatibles con cada cliente. El motor analiza presupuesto, ubicación, tipo de inmueble y urgencia de compra.
        </p>
      </div>
    </section>
  );
}
