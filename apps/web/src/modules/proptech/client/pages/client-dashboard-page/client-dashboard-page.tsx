import { useProptechDashboard } from '../../../shared/hooks/use-proptech-dashboard';
import type { ClientDashboard } from '../../../shared/hooks/use-proptech-dashboard';
import './client-dashboard-page.css';

export function ClientDashboardPage() {
  const { data, loading, error } = useProptechDashboard();
  const kpis = data as ClientDashboard | null;

  return (
    <section className="client-dashboard">
      <div className="client-dashboard__header">
        <p className="client-dashboard__eyebrow">Portal del cliente</p>
        <h2 className="client-dashboard__title">Tu búsqueda inmobiliaria</h2>
        <p className="client-dashboard__subtitle">
          Propiedades recomendadas, visitas y el estado de tus ofertas en un solo lugar.
        </p>
      </div>

      {loading && <p className="client-dashboard__loading">Cargando tu panel...</p>}
      {error && <p className="client-dashboard__error">{error}</p>}

      {kpis && (
        <div className="client-dashboard__stats">
          {[
            { label: 'Recomendaciones IA', value: kpis.recommendedProperties, highlight: true },
            { label: 'Favoritos', value: kpis.favoriteProperties },
            { label: 'Visitas agendadas', value: kpis.scheduledVisits },
            { label: 'Ofertas activas', value: kpis.activeOffers },
            { label: 'Contratos pendientes', value: kpis.contractsPending },
            { label: 'Nuevos matches', value: kpis.newMatches, highlight: true },
          ].map(({ label, value, highlight }) => (
            <div key={label} className={`client-stat${highlight ? ' client-stat--highlight' : ''}`}>
              <span className="client-stat__value">{value ?? 0}</span>
              <span className="client-stat__label">{label}</span>
            </div>
          ))}
        </div>
      )}

      <div className="client-dashboard__cta">
        <div className="client-cta-card client-cta-card--primary">
          <h3>Ver propiedades recomendadas</h3>
          <p>El sistema IA encontró propiedades compatibles con tu perfil y presupuesto.</p>
          <a href="/app/proptech/matching" className="client-cta-card__btn">Ver recomendaciones</a>
        </div>
        <div className="client-cta-card">
          <h3>Agendar una visita</h3>
          <p>Coordina una visita a la propiedad que más te interesa.</p>
          <a href="/app/proptech/visits" className="client-cta-card__btn client-cta-card__btn--secondary">Ver mis visitas</a>
        </div>
        <div className="client-cta-card">
          <h3>Buscar propiedades</h3>
          <p>Explora el catálogo completo con filtros por zona, precio y tipo.</p>
          <a href="/app/proptech/properties" className="client-cta-card__btn client-cta-card__btn--secondary">Ir al catálogo</a>
        </div>
      </div>
    </section>
  );
}
