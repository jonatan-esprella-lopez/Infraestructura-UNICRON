import { useState } from 'react';
import { useProperties } from '../../hooks/use-properties';
import type { PropertyFilters } from '../../types/property.types';
import { OPERATION_TYPE_LABELS, PROPERTY_TYPE_LABELS } from '../../constants/property-types.constant';
import './property-list-page.css';

export function PropertyListPage() {
  const [filters, setFilters] = useState<PropertyFilters>({ publicationStatus: 'published', limit: 20 });
  const { properties, total, loading, error } = useProperties(filters);

  return (
    <section className="property-list-page">
      <div className="property-list-page__header">
        <div>
          <p className="property-list-page__eyebrow">Proptech — Inmuebles</p>
          <h2 className="property-list-page__title">Catálogo de propiedades</h2>
          <p className="property-list-page__meta">{total} propiedades</p>
        </div>
        <a href="/app/proptech/properties/new" className="property-list-page__cta">
          + Nueva propiedad
        </a>
      </div>

      <div className="property-list-page__filters">
        <select
          onChange={(e) => setFilters((f) => ({ ...f, operationType: e.target.value as never || undefined }))}
        >
          <option value="">Tipo de operación</option>
          {Object.entries(OPERATION_TYPE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select
          onChange={(e) => setFilters((f) => ({ ...f, propertyType: e.target.value as never || undefined }))}
        >
          <option value="">Tipo de inmueble</option>
          {Object.entries(PROPERTY_TYPE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <input
          placeholder="Ciudad"
          onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value || undefined }))}
        />
      </div>

      {loading && <p className="property-list-page__loading">Cargando propiedades...</p>}
      {error && <p className="property-list-page__error">{error}</p>}

      <div className="property-list-page__grid">
        {properties.map((property) => (
          <article key={property.id} className="property-card">
            <div className="property-card__badge">{OPERATION_TYPE_LABELS[property.operationType]}</div>
            <h3 className="property-card__title">{property.title}</h3>
            <p className="property-card__location">{property.city}{property.zone ? `, ${property.zone}` : ''}</p>
            <div className="property-card__details">
              {property.bedrooms !== undefined && <span>{property.bedrooms} hab.</span>}
              {property.bathrooms !== undefined && <span>{property.bathrooms} baños</span>}
              <span>{property.areaTotal} m²</span>
            </div>
            <p className="property-card__price">
              {property.currency} {property.price.toLocaleString()}
            </p>
            <a href={`/app/proptech/properties/${property.id}`} className="property-card__link">
              Ver detalle
            </a>
          </article>
        ))}
        {!loading && properties.length === 0 && (
          <p className="property-list-page__empty">No se encontraron propiedades con los filtros aplicados.</p>
        )}
      </div>
    </section>
  );
}
