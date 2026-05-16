import { useState } from 'react';
import { useProperties } from '../../../shared/hooks';
import { OPERATION_TYPE_LABELS, PROPERTY_TYPE_LABELS } from '../../../constants/property-types.constant';
import type { PropertyFilters } from '../../../types/property.types';
import './public-property-search-page.css';

export function PublicPropertySearchPage() {
  const [filters, setFilters] = useState<PropertyFilters>({ publicationStatus: 'published', limit: 12 });
  const { properties, total, loading } = useProperties(filters);

  return (
    <section className="public-search">
      <div className="public-search__hero">
        <h1 className="public-search__hero-title">Encuentra tu propiedad ideal</h1>
        <p className="public-search__hero-sub">Explora el catálogo de inmuebles disponibles.</p>

        <div className="public-search__filters">
          <select onChange={(e) => setFilters((f) => ({ ...f, operationType: e.target.value as never || undefined }))}>
            <option value="">¿Qué buscas?</option>
            {Object.entries(OPERATION_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select onChange={(e) => setFilters((f) => ({ ...f, propertyType: e.target.value as never || undefined }))}>
            <option value="">Tipo de inmueble</option>
            {Object.entries(PROPERTY_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <input placeholder="Ciudad..." onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value || undefined }))} />
          <input type="number" placeholder="Precio máx. (USD)" onChange={(e) => setFilters((f) => ({ ...f, maxPrice: Number(e.target.value) || undefined }))} />
        </div>
      </div>

      <div className="public-search__results">
        <p className="public-search__count">{total} propiedades encontradas</p>

        {loading && <p className="public-search__loading">Buscando propiedades...</p>}

        <div className="public-search__grid">
          {properties.map((p) => (
            <article key={p.id} className="public-property-card">
              <div className="public-property-card__type">{OPERATION_TYPE_LABELS[p.operationType]}</div>
              <h3 className="public-property-card__title">{p.title}</h3>
              <p className="public-property-card__location">{p.city}{p.zone ? `, ${p.zone}` : ''}</p>
              <div className="public-property-card__features">
                {p.bedrooms !== undefined && <span>{p.bedrooms} hab.</span>}
                {p.bathrooms !== undefined && <span>{p.bathrooms} baños</span>}
                <span>{p.areaTotal} m²</span>
              </div>
              <p className="public-property-card__price">{p.currency} {p.price.toLocaleString()}</p>
              <a href={`/app/proptech/properties`} className="public-property-card__cta">Ver detalle</a>
            </article>
          ))}

          {!loading && properties.length === 0 && (
            <div className="public-search__empty">
              <p>No encontramos propiedades con los filtros seleccionados.</p>
              <button onClick={() => setFilters({ publicationStatus: 'published', limit: 12 })}>
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
