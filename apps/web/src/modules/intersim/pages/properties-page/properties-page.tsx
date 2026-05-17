import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ROUTES } from '@core/constants/routes.constants';
import { MapPin, Bed, Bath, Square, ArrowRight, Loader2, ChevronLeft, ChevronRight, Search, Map as MapIcon } from 'lucide-react';
import { propertyService } from '@modules/proptech/services/property.service';
import type { Property, PropertyFilters, OperationType, PropertyType } from '@modules/proptech/types/property.types';
import './properties-page.css';

const PAGE_SIZE = 9;

const BOLIVIAN_CITIES = ['Santa Cruz', 'Cochabamba', 'La Paz', 'Oruro', 'Potosí', 'Sucre', 'Tarija', 'Beni', 'Pando'];

const PROPERTY_TYPE_ICONS: Record<string, ReactNode> = {
  house: <Home size={14} />,
  apartment: <Building2 size={14} />,
  land: <Trees size={14} />,
  office: <Briefcase size={14} />,
};

const OPERATION_LABELS: Record<string, string> = {
  sale: 'Venta',
  rent: 'Alquiler',
  anticretico: 'Anticrético',
};

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  house: 'Casa',
  apartment: 'Departamento',
  land: 'Terreno',
  office: 'Oficina',
  commercial: 'Comercial',
  warehouse: 'Almacén',
  parking: 'Estacionamiento',
};

function formatPrice(price: number, currency: string, opType: string) {
  const formatted = new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: currency || 'USD',
    maximumFractionDigits: 0,
  }).format(price);
  return opType === 'rent' ? `${formatted}/mes` : formatted;
}

function getPropertyImage(prop: Property): string {
  if (prop.imageUrls && prop.imageUrls.length > 0) {
    const first = prop.imageUrls[0];
    if (first && first.startsWith('http')) return first;
  }
  return '/properties_hero.png';
}

function buildPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | '...')[] = [];
  pages.push(1);
  if (current > 4) pages.push('...');
  const start = Math.max(2, current - 2);
  const end = Math.min(total - 1, current + 2);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 3) pages.push('...');
  pages.push(total);
  return pages;
}

export function PropertiesPage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 6;

  // Seed filters from URL params (set by CasaLens chat)
  const [filters, setFilters] = useState<PropertyFilters>(() => {
    const initial: PropertyFilters = { publicationStatus: 'published' };
    const op = urlParams.get('operation') as OperationType | null;
    if (op) initial.operationType = op;
    const zone = urlParams.get('zone');
    if (zone) initial.zone = zone;
    const budget = urlParams.get('budget');
    if (budget) initial.maxPrice = Number(budget);
    const rooms = urlParams.get('rooms');
    if (rooms) initial.minBedrooms = Number(rooms);
    return initial;
  });
  const [searchTerm, setSearchTerm] = useState(urlParams.get('zone') ?? '');

  // Banner shown when coming from CasaLens
  const fromChat = urlParams.has('operation') || urlParams.has('zone') || urlParams.has('rooms');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localQuery !== query) updateParam('query', localQuery);
    }, 420);
    return () => clearTimeout(timer);
  }, [localQuery]);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const offset = (page - 1) * PAGE_SIZE;
      const filters: PropertyFilters = {
        publicationStatus: 'published',
        limit: PAGE_SIZE,
        offset,
      });
      if (res.items.length > 0) {
        setProperties(res.items);
        setTotal(res.total);
      } else {
        // Fallback to mock data if DB is empty for demo purposes
        const mockFiltered = MOCK_PROPERTIES.filter((p) => {
          if (currentFilters.city && !p.city.toLowerCase().includes(currentFilters.city.toLowerCase()) && !p.title.toLowerCase().includes(currentFilters.city.toLowerCase())) return false;
          if (currentFilters.operationType && p.operationType !== currentFilters.operationType) return false;
          if (currentFilters.zone && !p.address.toLowerCase().includes(currentFilters.zone.toLowerCase()) && !p.city.toLowerCase().includes(currentFilters.zone.toLowerCase())) return false;
          if (currentFilters.minBedrooms && (p.bedrooms ?? 0) < currentFilters.minBedrooms) return false;
          if (currentFilters.maxPrice && p.price > currentFilters.maxPrice) return false;
          return true;
        });
        setProperties(mockFiltered.slice(offset, offset + pageSize));
        setTotal(mockFiltered.length);
      }
    } catch (err) {
      console.error('Failed to fetch properties, using mocks:', err);
      const offset = (currentPage - 1) * pageSize;
      const mockFiltered = MOCK_PROPERTIES.filter((p) => {
        if (currentFilters.city && !p.city.toLowerCase().includes(currentFilters.city.toLowerCase()) && !p.title.toLowerCase().includes(currentFilters.city.toLowerCase())) return false;
        if (currentFilters.operationType && p.operationType !== currentFilters.operationType) return false;
        if (currentFilters.zone && !p.address.toLowerCase().includes(currentFilters.zone.toLowerCase()) && !p.city.toLowerCase().includes(currentFilters.zone.toLowerCase())) return false;
        if (currentFilters.minBedrooms && (p.bedrooms ?? 0) < currentFilters.minBedrooms) return false;
        if (currentFilters.maxPrice && p.price > currentFilters.maxPrice) return false;
        return true;
      });
      setProperties(mockFiltered.slice(offset, offset + pageSize));
      setTotal(mockFiltered.length);
    } finally {
      setLoading(false);
    }
  }, [page, query, operationType, propertyType, city, minPrice, maxPrice, minBedrooms, petsAllowed]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;
  const pageNumbers = buildPageNumbers(page, totalPages);

  const activeFilterCount = [operationType, propertyType, city, minPrice, maxPrice, minBedrooms, petsAllowed]
    .filter(Boolean).length;

  const clearFilters = () => {
    setLocalQuery('');
    setSearchParams({ page: '1' });
  };

  return (
    <div className="sub-page">
      <section className="sub-hero" style={{ backgroundImage: 'url(/properties_hero.png)' }}>
        <div className="sub-hero-overlay" />
        <div className="sub-hero-content">
          <h1>Explora Nuestras Propiedades</h1>
          <p>Descubre el lugar perfecto para vivir, invertir o trabajar en Bolivia.</p>
          {total > 0 && !loading && (
            <div className="sub-hero-stat">{total} propiedades publicadas</div>
          )}
        </div>
      </section>

      <section className="properties-section">
        <div className="properties-container">

          {/* ── Filter Bar ─────────────────────────────────────────────── */}
          <div className="prop-filter-bar">
            <div className="prop-search-wrapper">
              <Search className="prop-search-icon" size={18} />
              <input
                type="text"
                placeholder="Busca por título, zona o dirección..."
                className="prop-filter-input with-icon"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
              />
              {localQuery && (
                <button className="prop-search-clear" onClick={() => { setLocalQuery(''); updateParam('query', ''); }}>
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="prop-filter-main-row">
              <select className="prop-filter-select" value={operationType} onChange={(e) => updateParam('operation', e.target.value)}>
                <option value="">Cualquier operación</option>
                <option value="sale">Venta</option>
                <option value="rent">Alquiler</option>
                <option value="anticretico">Anticrético</option>
              </select>

              <select className="prop-filter-select" value={propertyType} onChange={(e) => updateParam('type', e.target.value)}>
                <option value="">Cualquier inmueble</option>
                <option value="house">Casa</option>
                <option value="apartment">Departamento</option>
                <option value="land">Terreno</option>
                <option value="office">Oficina</option>
                <option value="commercial">Comercial</option>
              </select>

              <select className="prop-filter-select" value={city} onChange={(e) => updateParam('city', e.target.value)}>
                <option value="">Cualquier ciudad</option>
                {BOLIVIAN_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <button
                className={`prop-more-filters-btn${showFilters ? ' active' : ''}`}
                onClick={() => setShowFilters((v) => !v)}
              >
                <SlidersHorizontal size={16} />
                Más filtros
                {activeFilterCount > 0 && <span className="prop-filter-badge">{activeFilterCount}</span>}
              </button>

              <button className="prop-map-btn" onClick={() => navigate(`/propiedades/mapa?${searchParams.toString()}`)}>
                <MapIcon size={18} />
                <span>Mapa</span>
              </button>
            </div>

            {showFilters && (
              <div className="prop-extra-filters">
                <div className="prop-extra-filters-inner">
                  <div className="prop-filter-group">
                    <label>Precio mínimo</label>
                    <select className="prop-filter-select" value={minPrice} onChange={(e) => updateParam('minPrice', e.target.value)}>
                      <option value="">Sin mínimo</option>
                      <option value="20000">$20,000</option>
                      <option value="50000">$50,000</option>
                      <option value="100000">$100,000</option>
                      <option value="200000">$200,000</option>
                      <option value="500000">$500,000</option>
                    </select>
                  </div>
                  <div className="prop-filter-group">
                    <label>Precio máximo</label>
                    <select className="prop-filter-select" value={maxPrice} onChange={(e) => updateParam('maxPrice', e.target.value)}>
                      <option value="">Sin máximo</option>
                      <option value="50000">$50,000</option>
                      <option value="100000">$100,000</option>
                      <option value="200000">$200,000</option>
                      <option value="500000">$500,000</option>
                      <option value="1000000">$1,000,000</option>
                    </select>
                  </div>
                  <div className="prop-filter-group">
                    <label>Habitaciones</label>
                    <select className="prop-filter-select" value={minBedrooms} onChange={(e) => updateParam('minBedrooms', e.target.value)}>
                      <option value="">Cualquiera</option>
                      <option value="1">1+ hab.</option>
                      <option value="2">2+ hab.</option>
                      <option value="3">3+ hab.</option>
                      <option value="4">4+ hab.</option>
                    </select>
                  </div>
                  <label className="prop-filter-checkbox-label">
                    <input type="checkbox" checked={petsAllowed} onChange={(e) => updateParam('petsAllowed', e.target.checked)} />
                    <span>Acepta mascotas</span>
                  </label>
                  {activeFilterCount > 0 && (
                    <button className="prop-clear-btn" onClick={clearFilters}>
                      <X size={14} /> Limpiar filtros
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {fromChat && (
            <div className="casalens-banner">
              <span className="casalens-banner__icon">🏠</span>
              <span>
                Mostrando propiedades filtradas por tu búsqueda en <strong>CasaLens</strong>
                {filters.operationType && ` · ${filters.operationType === 'rent' ? 'Alquiler' : filters.operationType === 'anticretico' ? 'Anticrético' : 'Venta'}`}
                {filters.zone && ` · ${filters.zone}`}
                {filters.minBedrooms && ` · ${filters.minBedrooms}+ dorm.`}
                {filters.maxPrice && ` · hasta USD ${Number(filters.maxPrice).toLocaleString()}`}
              </span>
              <button
                className="casalens-banner__clear"
                onClick={() => {
                  setFilters({ publicationStatus: 'published' });
                  setSearchTerm('');
                  navigate('/propiedades', { replace: true });
                }}
              >
                Limpiar filtros ✕
              </button>
            </div>
          )}

          {loading ? (
            <div className="prop-loading">
              <Loader2 className="spinner" size={44} />
              <p>Buscando propiedades...</p>
            </div>
          ) : error ? (
            <div className="prop-error">
              <AlertCircle size={48} />
              <h3>Error de conexión</h3>
              <p>{error}</p>
              <button className="prop-retry-btn" onClick={fetchProperties}>Reintentar</button>
            </div>
          ) : properties.length === 0 ? (
            <div className="prop-empty">
              <Home size={56} />
              <h3>No encontramos propiedades</h3>
              <p>Intenta cambiar los filtros o buscar en otra ciudad.</p>
              <button className="prop-retry-btn" onClick={clearFilters}>Ver todas las propiedades</button>
            </div>
          ) : (
            <>
              <div className="properties-grid">
                {properties.map((prop) => (
                  <PropertyCard key={prop.id} prop={prop} />
                ))}
              </div>

              {/* ── Pagination ─────────────────────────────────────────── */}
              {totalPages > 1 && (
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  pageNumbers={pageNumbers}
                  onGoTo={goToPage}
                />
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────────────────── */

function PropertyCard({ prop }: { prop: Property }) {
  const image = getPropertyImage(prop);
  const opLabel = OPERATION_LABELS[prop.operationType] ?? prop.operationType;
  const typeLabel = PROPERTY_TYPE_LABELS[prop.propertyType] ?? prop.propertyType;
  const typeIcon = PROPERTY_TYPE_ICONS[prop.propertyType];

  return (
    <article className="prop-card">
      <div className="prop-card-image" style={{ backgroundImage: `url(${image})` }}>
        <span className={`prop-badge op-${prop.operationType}`}>{opLabel}</span>
        {prop.isFeatured && <span className="prop-badge-featured">Destacado</span>}
        <div className="prop-price">{formatPrice(prop.price, prop.currency, prop.operationType)}</div>
      </div>
      <div className="prop-card-body">
        <div className="prop-type-chip">
          {typeIcon}
          <span>{typeLabel}</span>
        </div>
        <h3 className="prop-title">{prop.title}</h3>
        <div className="prop-location">
          <MapPin size={14} />
          <span>{prop.address}{prop.city ? `, ${prop.city}` : ''}</span>
        </div>
        <div className="prop-features">
          {(prop.bedrooms ?? 0) > 0 && (
            <span className="prop-feature">
              <Bed size={14} /> {prop.bedrooms} hab.
            </span>
          )}
          {(prop.bathrooms ?? 0) > 0 && (
            <span className="prop-feature">
              <Bath size={14} /> {prop.bathrooms} baños
            </span>
          )}
          {(prop.areaTotal ?? 0) > 0 && (
            <span className="prop-feature">
              <Square size={14} /> {prop.areaTotal} m²
            </span>
          )}
        </div>
        <button className="prop-card-btn">
          Ver detalles <ArrowRight size={15} />
        </button>
      </div>
    </article>
  );
}

interface PaginationProps {
  page: number;
  totalPages: number;
  pageNumbers: (number | '...')[];
  onGoTo: (p: number) => void;
}

function Pagination({ page, totalPages, pageNumbers, onGoTo }: PaginationProps) {
  return (
    <nav className="prop-pagination" aria-label="Paginación de propiedades">
      <button
        className="prop-page-btn prop-page-btn--icon"
        disabled={page === 1}
        onClick={() => onGoTo(1)}
        title="Primera página"
      >
        <ChevronFirst size={17} />
      </button>
      <button
        className="prop-page-btn prop-page-btn--icon"
        disabled={page === 1}
        onClick={() => onGoTo(page - 1)}
        title="Página anterior"
      >
        <ChevronLeft size={17} />
      </button>

      <div className="prop-page-numbers">
        {pageNumbers.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="prop-page-ellipsis">…</span>
          ) : (
            <button
              key={p}
              className={`prop-page-num${p === page ? ' active' : ''}`}
              onClick={() => onGoTo(p as number)}
              disabled={p === page}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        className="prop-page-btn prop-page-btn--icon"
        disabled={page === totalPages}
        onClick={() => onGoTo(page + 1)}
        title="Página siguiente"
      >
        <ChevronRight size={17} />
      </button>
      <button
        className="prop-page-btn prop-page-btn--icon"
        disabled={page === totalPages}
        onClick={() => onGoTo(totalPages)}
        title="Última página"
      >
        <ChevronLast size={17} />
      </button>
    </nav>
  );
}
