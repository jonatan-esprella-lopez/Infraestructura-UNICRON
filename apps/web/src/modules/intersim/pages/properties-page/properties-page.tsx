import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ROUTES } from '@core/constants/routes.constants';
import { MapPin, Bed, Bath, Square, ArrowRight, Loader2, ChevronLeft, ChevronRight, Search, Map as MapIcon } from 'lucide-react';
import { propertyService } from '@modules/proptech/services/property.service';
import type { Property, PropertyFilters, OperationType, PropertyType } from '@modules/proptech/types/property.types';
import './properties-page.css';

const MOCK_PROPERTIES = [
  { id: 'm1', title: 'Villa Moderna', operationType: 'sale', price: 450000, currency: 'USD', address: 'Urubó', city: 'Santa Cruz', bedrooms: 4, bathrooms: 3, areaTotal: 350, image: '/properties_hero.png' },
  { id: 'm2', title: 'Penthouse Ejecutivo', operationType: 'anticretico', price: 50000, currency: 'USD', address: 'Equipetrol', city: 'Santa Cruz', bedrooms: 2, bathrooms: 2, areaTotal: 150, image: '/service_alquiler.png' },
  { id: 'm3', title: 'Casa Familiar', operationType: 'sale', price: 220000, currency: 'USD', address: 'Cala Cala', city: 'Cochabamba', bedrooms: 3, bathrooms: 2, areaTotal: 200, image: '/service_compra.png' },
  { id: 'm4', title: 'Departamento de Lujo', operationType: 'rent', price: 800, currency: 'USD', address: 'Calacoto', city: 'La Paz', bedrooms: 2, bathrooms: 2, areaTotal: 120, image: '/service_anticretico.png' },
  { id: 'm5', title: 'Terreno Comercial', operationType: 'sale', price: 150000, currency: 'USD', address: 'Zona Norte', city: 'Santa Cruz', bedrooms: 0, bathrooms: 0, areaTotal: 500, image: '/hero-bg.png' },
  { id: 'm6', title: 'Condominio Exclusivo', operationType: 'sale', price: 310000, currency: 'USD', address: 'Tiquipaya', city: 'Cochabamba', bedrooms: 4, bathrooms: 4, areaTotal: 280, image: '/properties_hero.png' },
] as unknown as Property[];

const formatPrice = (val: number, curr: string, type: string) => {
  const formatted = new Intl.NumberFormat('es-BO', { style: 'currency', currency: curr, maximumFractionDigits: 0 }).format(val);
  return type === 'rent' ? `${formatted}/mes` : formatted;
};

const getOperationLabel = (type: string) => {
  if (type === 'sale') return 'Venta';
  if (type === 'rent') return 'Alquiler';
  if (type === 'anticretico') return 'Anticrético';
  return type;
};

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
      setPage(1);
      setFilters((prev) => ({
        ...prev,
        city: searchTerm || undefined, // For demo, searching by city
      }));
    }, 400); // 400ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchProperties = async (currentPage: number, currentFilters: PropertyFilters) => {
    setLoading(true);
    try {
      const offset = (currentPage - 1) * pageSize;
      const res = await propertyService.findAll({
        ...currentFilters,
        limit: pageSize,
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
  };

  useEffect(() => {
    fetchProperties(page, filters);
  }, [page, filters]);

  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <div className="sub-page">
      <section className="sub-hero" style={{ backgroundImage: 'url(/properties_hero.png)' }}>
        <div className="sub-hero-overlay" />
        <div className="sub-hero-content">
          <h1>Explora Nuestras Propiedades</h1>
          <p>Descubre el lugar perfecto para vivir, invertir o trabajar.</p>
        </div>
      </section>

      <section className="properties-section">
        <div className="properties-container">
          <div className="properties-filters">
            <div className="prop-search-wrapper">
              <Search className="prop-search-icon" size={20} />
              <input
                type="text"
                placeholder="Busca por ciudad o título..."
                className="prop-filter-input with-icon"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="prop-filter-select"
              value={filters.operationType || ''}
              onChange={(e) => {
                setPage(1);
                setFilters((prev) => ({ ...prev, operationType: (e.target.value as OperationType) || undefined }));
              }}
            >
              <option value="">Cualquier Operación</option>
              <option value="sale">Venta</option>
              <option value="rent">Alquiler</option>
              <option value="anticretico">Anticrético</option>
            </select>
            <select
              className="prop-filter-select"
              value={filters.propertyType || ''}
              onChange={(e) => {
                setPage(1);
                setFilters((prev) => ({ ...prev, propertyType: (e.target.value as PropertyType) || undefined }));
              }}
            >
              <option value="">Cualquier Inmueble</option>
              <option value="house">Casa</option>
              <option value="apartment">Departamento</option>
              <option value="land">Terreno</option>
              <option value="office">Oficina</option>
            </select>
            <button 
              className="prop-map-btn" 
              onClick={() => navigate('/propiedades/mapa')}
              style={{ backgroundImage: 'url(/map_btn_bg.png)' }}
            >
              <MapIcon size={22} />
              <span>Buscar en mapa</span>
            </button>
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
              <Loader2 className="spinner" size={48} />
              <p>Buscando propiedades...</p>
            </div>
          ) : (
            <>
              <div className="properties-grid">
                {properties.map((prop) => {
                  const image = (prop as any).image || '/properties_hero.png';
                  return (
                    <div key={prop.id} className="prop-card">
                      <div className="prop-card-image" style={{ backgroundImage: `url(${image})` }}>
                        <span className={`prop-badge type-${prop.operationType}`}>{getOperationLabel(prop.operationType)}</span>
                        <div className="prop-price">{formatPrice(prop.price, prop.currency, prop.operationType)}</div>
                      </div>
                      <div className="prop-card-body">
                        <h3 className="prop-title">{prop.title}</h3>
                        <div className="prop-location">
                          <MapPin size={16} /> {prop.address}, {prop.city}
                        </div>
                        <div className="prop-features">
                          {(prop.bedrooms ?? 0) > 0 && (
                            <span className="prop-feature">
                              <Bed size={16} /> {prop.bedrooms}
                            </span>
                          )}
                          {(prop.bathrooms ?? 0) > 0 && (
                            <span className="prop-feature">
                              <Bath size={16} /> {prop.bathrooms}
                            </span>
                          )}
                          <span className="prop-feature">
                            <Square size={16} /> {prop.areaTotal} m²
                          </span>
                        </div>
                        <button className="prop-card-btn" onClick={() => navigate(ROUTES.login)}>
                          Ver detalles <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="prop-pagination">
                  <button
                    className="prop-page-btn"
                    disabled={page === 1}
                    onClick={() => {
                      setPage((p) => Math.max(1, p - 1));
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                  >
                    <ChevronLeft size={20} /> Anterior
                  </button>
                  <span className="prop-page-info">
                    Página {page} de {totalPages}
                  </span>
                  <button
                    className="prop-page-btn"
                    disabled={page === totalPages}
                    onClick={() => {
                      setPage((p) => Math.min(totalPages, p + 1));
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                  >
                    Siguiente <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
