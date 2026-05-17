import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  CircleDollarSign,
  FileCheck2,
  Home,
  MapPin,
  Plus,
  Search,
} from 'lucide-react';
import { ROUTES } from '@core/constants/routes.constants';
import { useRootStore } from '@store/root-store';
import { useProperties } from '../../../hooks/use-properties';
import type { Property, PublicationStatus } from '../../../types/property.types';
import {
  LEGAL_STATUS_LABELS,
  OPERATION_TYPE_LABELS,
  PROPERTY_TYPE_LABELS,
  PUBLICATION_STATUS_LABELS,
} from '../../../constants/property-types.constant';
import './owner-properties-page.css';

type OwnerFilter = 'all' | PublicationStatus;

const PROPERTY_TONES: Record<string, string> = {
  apartment: 'linear-gradient(135deg, #dbeafe 0%, #ecfeff 100%)',
  house: 'linear-gradient(135deg, #dcfce7 0%, #fef9c3 100%)',
  land: 'linear-gradient(135deg, #f0fdf4 0%, #d9f99d 100%)',
  commercial: 'linear-gradient(135deg, #ffedd5 0%, #fee2e2 100%)',
  office: 'linear-gradient(135deg, #e0e7ff 0%, #f5f3ff 100%)',
  warehouse: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
  parking: 'linear-gradient(135deg, #e2e8f0 0%, #fafafa 100%)',
};

function formatMoney(property: Property) {
  return new Intl.NumberFormat(property.currency === 'BOB' ? 'es-BO' : 'en-US', {
    style: 'currency',
    currency: property.currency,
    maximumFractionDigits: 0,
  }).format(property.price || 0);
}

function getPrimaryMetric(property: Property) {
  if (property.propertyType === 'land') return `${property.areaTotal || 0} m2 de terreno`;
  if (property.bedrooms) return `${property.bedrooms} dormitorios`;
  if (property.areaBuilt) return `${property.areaBuilt} m2 construidos`;
  return `${property.areaTotal || 0} m2`;
}

export function OwnerPropertiesPage() {
  const { currentUser } = useRootStore();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<OwnerFilter>('all');
  const { properties, total, loading, error } = useProperties({
    ownerId: currentUser.id,
    limit: 80,
    offset: 0,
  });

  const filteredProperties = useMemo(() => {
    const term = query.trim().toLowerCase();
    return properties.filter((property) => {
      const statusOk = filter === 'all' || property.publicationStatus === filter;
      const termOk = !term
        || property.title.toLowerCase().includes(term)
        || (property.city ?? '').toLowerCase().includes(term)
        || (property.zone ?? '').toLowerCase().includes(term)
        || (property.address ?? '').toLowerCase().includes(term);
      return statusOk && termOk;
    });
  }, [filter, properties, query]);

  const stats = useMemo(() => {
    const published = properties.filter((item) => item.publicationStatus === 'published').length;
    const pending = properties.filter((item) => item.publicationStatus === 'pending_review').length;
    const documentsReady = properties.filter((item) => item.legalStatus === 'clear').length;
    return { published, pending, documentsReady };
  }, [properties]);

  return (
    <section className="owner-properties">
      <div className="owner-properties__hero">
        <div>
          <p className="owner-properties__eyebrow">Portal del propietario</p>
          <h2>Mis propiedades</h2>
          <p>
            Revisa tus inmuebles registrados, su estado de publicación y los datos principales antes de enviarlos a revisión.
          </p>
        </div>
        <Link to={ROUTES.proptechPropertyNew} className="owner-properties__new-btn">
          <Plus size={18} />
          Registrar nueva propiedad
        </Link>
      </div>

      <div className="owner-properties__stats">
        <div className="owner-property-stat">
          <Building2 size={20} />
          <strong>{total}</strong>
          <span>Total registradas</span>
        </div>
        <div className="owner-property-stat owner-property-stat--green">
          <Home size={20} />
          <strong>{stats.published}</strong>
          <span>Publicadas</span>
        </div>
        <div className="owner-property-stat owner-property-stat--amber">
          <CalendarCheck size={20} />
          <strong>{stats.pending}</strong>
          <span>En revisión</span>
        </div>
        <div className="owner-property-stat owner-property-stat--blue">
          <FileCheck2 size={20} />
          <strong>{stats.documentsReady}</strong>
          <span>Documentación saneada</span>
        </div>
      </div>

      <div className="owner-properties__toolbar">
        <div className="owner-properties__search">
          <Search size={17} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por título, ciudad, zona o dirección"
          />
        </div>
        <div className="owner-properties__filters" aria-label="Filtrar por estado">
          {[
            { label: 'Todas', value: 'all' },
            { label: 'Publicadas', value: 'published' },
            { label: 'En revisión', value: 'pending_review' },
            { label: 'Borrador', value: 'unpublished' },
          ].map((item) => (
            <button
              key={item.value}
              className={filter === item.value ? 'owner-properties__filter owner-properties__filter--active' : 'owner-properties__filter'}
              onClick={() => setFilter(item.value as OwnerFilter)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="owner-properties__state">Cargando tus propiedades...</div>}
      {error && !loading && <div className="owner-properties__state owner-properties__state--error">{error}</div>}

      {!loading && !error && filteredProperties.length === 0 && (
        <div className="owner-properties__empty">
          <Building2 size={44} />
          <h3>{properties.length === 0 ? 'Todavía no tienes propiedades registradas' : 'No hay resultados con esos filtros'}</h3>
          <p>Registra tu primer inmueble con datos completos y una vista previa antes de enviarlo a revisión.</p>
          <Link to={ROUTES.proptechPropertyNew} className="owner-properties__new-btn">
            <Plus size={18} />
            Registrar propiedad
          </Link>
        </div>
      )}

      {!loading && !error && filteredProperties.length > 0 && (
        <div className="owner-properties__grid">
          {filteredProperties.map((property) => (
            <article key={property.id} className="owner-property-card">
              <div
                className="owner-property-card__media"
                style={{ background: PROPERTY_TONES[property.propertyType] ?? PROPERTY_TONES.house }}
              >
                <Building2 size={42} />
                <span>{OPERATION_TYPE_LABELS[property.operationType]}</span>
              </div>
              <div className="owner-property-card__body">
                <div className="owner-property-card__head">
                  <span>{PROPERTY_TYPE_LABELS[property.propertyType]}</span>
                  <strong>{PUBLICATION_STATUS_LABELS[property.publicationStatus]}</strong>
                </div>
                <h3>{property.title}</h3>
                <p className="owner-property-card__location">
                  <MapPin size={15} />
                  {property.city}{property.zone ? `, ${property.zone}` : ''}
                </p>
                <div className="owner-property-card__facts">
                  <span>{getPrimaryMetric(property)}</span>
                  {property.bathrooms !== undefined && <span>{property.bathrooms} baños</span>}
                  {property.parkingSpaces !== undefined && <span>{property.parkingSpaces} parqueos</span>}
                </div>
              </div>
              <div className="owner-property-card__footer">
                <div>
                  <small>Precio publicado</small>
                  <strong><CircleDollarSign size={17} /> {formatMoney(property)}</strong>
                </div>
                <span className="owner-property-card__legal">{LEGAL_STATUS_LABELS[property.legalStatus]}</span>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="owner-properties__next">
        <div>
          <span>Próximo paso</span>
          <strong>Completa datos y documentos para publicar con menos observaciones.</strong>
        </div>
        <Link to={ROUTES.proptechPropertyNew}>
          Añadir otro inmueble
          <ArrowRight size={17} />
        </Link>
      </div>
    </section>
  );
}
