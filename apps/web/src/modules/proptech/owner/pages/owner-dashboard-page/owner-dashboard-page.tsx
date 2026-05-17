import { useProptechDashboard } from '../../../shared/hooks/use-proptech-dashboard';
import type { OwnerDashboard } from '../../../shared/hooks/use-proptech-dashboard';
import { ROUTES } from '@core/constants/routes.constants';
import './owner-dashboard-page.css';

export function OwnerDashboardPage() {
  const { data, loading, error } = useProptechDashboard();
  const kpis = data as OwnerDashboard | null;

  return (
    <section className="owner-dashboard">
      <div className="owner-dashboard__header">
        <p className="owner-dashboard__eyebrow">Portal del propietario</p>
        <h2 className="owner-dashboard__title">El estado de tus propiedades</h2>
        <p className="owner-dashboard__subtitle">
          Toda la información sobre tus inmuebles, visitas e interesados en un solo lugar.
        </p>
      </div>

      {loading && <p className="owner-dashboard__loading">Cargando información...</p>}
      {error && <p className="owner-dashboard__error">{error}</p>}

      {kpis && (
        <div className="owner-dashboard__stats">
          {[
            { label: 'Mis propiedades', value: kpis.ownedProperties },
            { label: 'Publicadas', value: kpis.publishedProperties },
            { label: 'Visualizaciones', value: kpis.propertyViews },
            { label: 'Interesados', value: kpis.interestedClients },
            { label: 'Visitas agendadas', value: kpis.scheduledVisits },
            { label: 'Ofertas recibidas', value: kpis.receivedOffers },
            { label: 'Documentos pendientes', value: kpis.documentsPending },
          ].map(({ label, value }) => (
            <div key={label} className="owner-stat">
              <span className="owner-stat__value">{value ?? 0}</span>
              <span className="owner-stat__label">{label}</span>
            </div>
          ))}
        </div>
      )}

      <div className="owner-dashboard__actions">
        <h3>¿Qué quieres hacer?</h3>
        <div className="owner-dashboard__action-cards">
          {[
            { title: 'Registrar propiedad', description: 'Crea un inmueble con vista previa antes de guardarlo.', href: ROUTES.proptechPropertyNew },
            { title: 'Ver mis propiedades', description: 'Revisa el estado y rendimiento de cada inmueble.', href: '/app/proptech/properties' },
            { title: 'Ver visitas', description: 'Consulta las visitas agendadas y sus resultados.', href: '/app/proptech/visits' },
            { title: 'Ver ofertas', description: 'Revisa las ofertas que han recibido tus inmuebles.', href: '/app/proptech/leads' },
            { title: 'Gestionar documentos', description: 'Sube o revisa los documentos de tus propiedades.', href: '/app/proptech/contracts' },
          ].map((card) => (
            <a key={card.href} href={card.href} className="owner-action-card">
              <strong>{card.title}</strong>
              <span>{card.description}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
