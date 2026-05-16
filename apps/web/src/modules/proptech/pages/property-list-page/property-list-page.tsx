import { useState, useCallback } from 'react';
import { useProperties } from '../../hooks/use-properties';
import type { PropertyFilters, OperationType, PropertyType, PublicationStatus } from '../../types/property.types';
import {
  OPERATION_TYPE_LABELS,
  PROPERTY_TYPE_LABELS,
  PUBLICATION_STATUS_LABELS,
} from '../../constants/property-types.constant';
import './property-list-page.css';

const PAGE_SIZE = 12;

type ViewMode = 'cards' | 'list';

const PROPERTY_ICONS: Record<string, string> = {
  apartment: '🏢',
  house: '🏡',
  office: '🏗️',
  land: '🌿',
  commercial: '🏪',
  warehouse: '🏭',
  parking: '🅿️',
};

function ImgPlaceholder({ type }: { type: string }) {
  return (
    <div className="plp-img">
      <span className="plp-img__icon">{PROPERTY_ICONS[type] ?? '🏠'}</span>
    </div>
  );
}

function OpBadge({ type }: { type: string }) {
  return (
    <span className={`plp-badge plp-badge--op-${type}`}>
      {OPERATION_TYPE_LABELS[type as OperationType] ?? type}
    </span>
  );
}

function PubBadge({ status }: { status: string }) {
  return (
    <span className={`plp-badge plp-badge--pub-${status}`}>
      {PUBLICATION_STATUS_LABELS[status as PublicationStatus] ?? status}
    </span>
  );
}

function getPageRange(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);
  const out: (number | '...')[] = [0];
  if (current > 2) out.push('...');
  for (let i = Math.max(1, current - 1); i <= Math.min(total - 2, current + 1); i++) out.push(i);
  if (current < total - 3) out.push('...');
  out.push(total - 1);
  return out;
}

export function PropertyListPage() {
  const [view, setView] = useState<ViewMode>('cards');
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState<PropertyFilters>({
    limit: PAGE_SIZE,
    offset: 0,
  });

  const { properties, total, loading, error } = useProperties(filters);

  const applyFilter = useCallback((updates: Partial<PropertyFilters>) => {
    setPage(0);
    setFilters((prev) => ({ ...prev, ...updates, offset: 0 }));
  }, []);

  const goToPage = (p: number) => {
    setPage(p);
    setFilters((prev) => ({ ...prev, offset: p * PAGE_SIZE }));
  };

  const clearFilters = () => {
    setPage(0);
    setFilters({ limit: PAGE_SIZE, offset: 0 });
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const from = total === 0 ? 0 : page * PAGE_SIZE + 1;
  const to = Math.min((page + 1) * PAGE_SIZE, total);

  return (
    <div className="plp">

      {/* ── Header ── */}
      <div className="plp-header">
        <div>
          <p className="plp-header__crumb">Proptech / Propiedades</p>
          <h2 className="plp-header__title">Catálogo de Propiedades</h2>
        </div>
        <a href="/app/proptech/properties/new" className="plp-btn plp-btn--primary">
          + Nueva Propiedad
        </a>
      </div>

      {/* ── Filters panel ── */}
      <div className="plp-filters-wrap">
        <button className="plp-filters-toggle" onClick={() => setShowFilters((s) => !s)}>
          <span>🔍 Filtros avanzados</span>
          <span className="plp-filters-toggle__caret">{showFilters ? '▲' : '▼'}</span>
        </button>

        {showFilters && (
          <div className="plp-filters">
            <div className="plp-filter-group">
              <label className="plp-filter-label">Operación</label>
              <select
                className="plp-filter-select"
                value={filters.operationType ?? ''}
                onChange={(e) => {
                  const v = e.target.value;
                  applyFilter({ operationType: v ? (v as OperationType) : undefined });
                }}
              >
                <option value="">Todas</option>
                {Object.entries(OPERATION_TYPE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>

            <div className="plp-filter-group">
              <label className="plp-filter-label">Tipo de inmueble</label>
              <select
                className="plp-filter-select"
                value={filters.propertyType ?? ''}
                onChange={(e) => {
                  const v = e.target.value;
                  applyFilter({ propertyType: v ? (v as PropertyType) : undefined });
                }}
              >
                <option value="">Todos</option>
                {Object.entries(PROPERTY_TYPE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>

            <div className="plp-filter-group">
              <label className="plp-filter-label">Estado de publicación</label>
              <select
                className="plp-filter-select"
                value={filters.publicationStatus ?? ''}
                onChange={(e) => {
                  const v = e.target.value;
                  applyFilter({ publicationStatus: v ? (v as PublicationStatus) : undefined });
                }}
              >
                <option value="">Todos</option>
                {Object.entries(PUBLICATION_STATUS_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>

            <div className="plp-filter-group">
              <label className="plp-filter-label">Ciudad</label>
              <input
                className="plp-filter-input"
                placeholder="ej. La Paz"
                value={filters.city ?? ''}
                onChange={(e) => applyFilter({ city: e.target.value || undefined })}
              />
            </div>

            <div className="plp-filter-group">
              <label className="plp-filter-label">Zona / Barrio</label>
              <input
                className="plp-filter-input"
                placeholder="ej. Miraflores"
                value={filters.zone ?? ''}
                onChange={(e) => applyFilter({ zone: e.target.value || undefined })}
              />
            </div>

            <div className="plp-filter-group">
              <label className="plp-filter-label">Precio mín.</label>
              <input
                className="plp-filter-input"
                type="number"
                placeholder="0"
                value={filters.minPrice ?? ''}
                onChange={(e) => applyFilter({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
              />
            </div>

            <div className="plp-filter-group">
              <label className="plp-filter-label">Precio máx.</label>
              <input
                className="plp-filter-input"
                type="number"
                placeholder="Sin límite"
                value={filters.maxPrice ?? ''}
                onChange={(e) => applyFilter({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
              />
            </div>

            <div className="plp-filter-group">
              <label className="plp-filter-label">Hab. mín.</label>
              <input
                className="plp-filter-input"
                type="number"
                placeholder="0"
                min="0"
                value={filters.minBedrooms ?? ''}
                onChange={(e) => applyFilter({ minBedrooms: e.target.value ? Number(e.target.value) : undefined })}
              />
            </div>

            <button className="plp-btn plp-btn--ghost" onClick={clearFilters}>
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* ── Toolbar ── */}
      <div className="plp-toolbar">
        <span className="plp-toolbar__count">
          {loading
            ? 'Cargando...'
            : total === 0
              ? 'Sin propiedades'
              : `Mostrando ${from}–${to} de ${total} propiedades`}
        </span>
        <div className="plp-view-toggle">
          <button
            className={`plp-view-btn${view === 'cards' ? ' plp-view-btn--active' : ''}`}
            onClick={() => setView('cards')}
          >
            ⊞ Tarjetas
          </button>
          <button
            className={`plp-view-btn${view === 'list' ? ' plp-view-btn--active' : ''}`}
            onClick={() => setView('list')}
          >
            ≡ Lista
          </button>
        </div>
      </div>

      {/* ── States ── */}
      {error && !loading && (
        <div className="plp-state plp-state--error">⚠️ {error}</div>
      )}
      {loading && (
        <div className="plp-state">
          <div className="plp-spinner" /> Cargando propiedades...
        </div>
      )}
      {!loading && properties.length === 0 && (
        <div className="plp-empty">
          <span className="plp-empty__icon">🏘️</span>
          <p className="plp-empty__text">No se encontraron propiedades</p>
          <p className="plp-empty__sub">Ajusta los filtros o agrega una nueva propiedad</p>
        </div>
      )}

      {/* ── Cards view ── */}
      {!loading && properties.length > 0 && view === 'cards' && (
        <div className="plp-grid">
          {properties.map((p) => (
            <article key={p.id} className="plp-card">
              <div className="plp-card__img-wrap">
                <ImgPlaceholder type={p.propertyType} />
                <div className="plp-card__badges">
                  <OpBadge type={p.operationType} />
                  {p.isFeatured && <span className="plp-badge plp-badge--featured">⭐ Destacado</span>}
                </div>
              </div>
              <div className="plp-card__body">
                <div className="plp-card__row">
                  <span className="plp-card__type">{PROPERTY_TYPE_LABELS[p.propertyType]}</span>
                  <PubBadge status={p.publicationStatus} />
                </div>
                <h3 className="plp-card__title">{p.title}</h3>
                <p className="plp-card__location">📍 {p.city}{p.zone ? `, ${p.zone}` : ''}</p>
                <div className="plp-card__specs">
                  {p.bedrooms !== undefined && <span className="plp-card__spec">🛏 {p.bedrooms} hab.</span>}
                  {p.bathrooms !== undefined && <span className="plp-card__spec">🚿 {p.bathrooms} baños</span>}
                  <span className="plp-card__spec">📐 {p.areaTotal} m²</span>
                  {!!p.parkingSpaces && <span className="plp-card__spec">🅿 {p.parkingSpaces}</span>}
                </div>
              </div>
              <div className="plp-card__footer">
                <p className="plp-card__price">{p.currency} {p.price.toLocaleString()}</p>
                <a href={`/app/proptech/properties/${p.id}`} className="plp-btn plp-btn--sm">
                  Ver detalle →
                </a>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* ── List view ── */}
      {!loading && properties.length > 0 && view === 'list' && (
        <div className="plp-table-wrap">
          <table className="plp-table">
            <thead>
              <tr>
                <th>Inmueble</th>
                <th>Tipo</th>
                <th>Operación</th>
                <th>Precio</th>
                <th>Ubicación</th>
                <th>Área</th>
                <th>Hab.</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="plp-table-thumb">
                      <ImgPlaceholder type={p.propertyType} />
                      <span className="plp-table-thumb__title">{p.title}</span>
                    </div>
                  </td>
                  <td>{PROPERTY_TYPE_LABELS[p.propertyType]}</td>
                  <td><OpBadge type={p.operationType} /></td>
                  <td className="plp-table__price">{p.currency} {p.price.toLocaleString()}</td>
                  <td>{p.city}{p.zone ? `, ${p.zone}` : ''}</td>
                  <td>{p.areaTotal} m²</td>
                  <td>{p.bedrooms ?? '—'}</td>
                  <td><PubBadge status={p.publicationStatus} /></td>
                  <td>
                    <a href={`/app/proptech/properties/${p.id}`} className="plp-btn plp-btn--sm plp-btn--ghost">
                      Ver →
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Pagination ── */}
      {!loading && total > PAGE_SIZE && (
        <div className="plp-pagination">
          <button
            className="plp-page-btn"
            disabled={page === 0}
            onClick={() => goToPage(page - 1)}
          >
            ← Anterior
          </button>
          <div className="plp-page-nums">
            {getPageRange(page, totalPages).map((item, idx) =>
              item === '...'
                ? <span key={`e${idx}`} className="plp-page-ellipsis">…</span>
                : (
                  <button
                    key={item}
                    className={`plp-page-num${item === page ? ' plp-page-num--active' : ''}`}
                    onClick={() => goToPage(item)}
                  >
                    {item + 1}
                  </button>
                ),
            )}
          </div>
          <button
            className="plp-page-btn"
            disabled={page >= totalPages - 1}
            onClick={() => goToPage(page + 1)}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}
