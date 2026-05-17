import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Loader2, Search, ArrowLeft } from 'lucide-react';
import { propertyService } from '@modules/proptech/services/property.service';
import type { Property, PropertyFilters, OperationType, PropertyType } from '@modules/proptech/types/property.types';
import './properties-map-page.css';

const MOCK_PROPERTIES = [
  { id: 'm1', title: 'Villa Moderna', operationType: 'sale', price: 450000, currency: 'USD', address: 'Urubó', city: 'Santa Cruz', bedrooms: 4, bathrooms: 3, areaTotal: 350, image: '/properties_hero.png' },
  { id: 'm2', title: 'Penthouse Ejecutivo', operationType: 'anticretico', price: 50000, currency: 'USD', address: 'Equipetrol', city: 'Santa Cruz', bedrooms: 2, bathrooms: 2, areaTotal: 150, image: '/service_alquiler.png' },
  { id: 'm3', title: 'Casa Familiar', operationType: 'sale', price: 220000, currency: 'USD', address: 'Cala Cala', city: 'Cochabamba', bedrooms: 3, bathrooms: 2, areaTotal: 200, image: '/service_compra.png' },
  { id: 'm4', title: 'Departamento de Lujo', operationType: 'rent', price: 800, currency: 'USD', address: 'Calacoto', city: 'La Paz', bedrooms: 2, bathrooms: 2, areaTotal: 120, image: '/service_anticretico.png' },
];

function formatPrice(price: number | undefined, currency: string | undefined, operation: string | undefined) {
  if (price === undefined) return 'Consultar precio';
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    maximumFractionDigits: 0,
  });
  const value = formatter.format(price);
  return operation === 'rent' ? `${value}/mes` : value;
}

function getOperationLabel(type: string | undefined) {
  if (type === 'sale') return 'Venta';
  if (type === 'rent') return 'Alquiler';
  if (type === 'anticretico') return 'Anticrético';
  return 'Inmueble';
}

export function PropertiesMapPage() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES as any[]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Force strict 100% height and hidden overflow on both html and body
    // This tells the Google Maps Embed API that the window is absolutely not scrollable
    const htmlOverflow = document.documentElement.style.overflow;
    const htmlHeight = document.documentElement.style.height;
    const bodyOverflow = document.body.style.overflow;
    const bodyHeight = document.body.style.height;
    
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.height = '100%';
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100%';

    return () => {
      document.documentElement.style.overflow = htmlOverflow;
      document.documentElement.style.height = htmlHeight;
      document.body.style.overflow = bodyOverflow;
      document.body.style.height = bodyHeight;
    };
  }, []);

  // Fetch properties (same as properties-page)
  useEffect(() => {
    let isMounted = true;
    async function fetchProperties() {
      setLoading(true);
      try {
        const queryParams: PropertyFilters = { ...filters };
        if (searchTerm) {
          queryParams.query = searchTerm;
        }
        queryParams.limit = 50; // map can handle more markers
        const result = await propertyService.getProperties(queryParams);
        if (isMounted) {
          if (result && result.data && result.data.length > 0) {
            setProperties(result.data);
          } else {
            setProperties(MOCK_PROPERTIES as any[]);
          }
        }
      } catch (err) {
        console.error('Error fetching properties for map:', err);
        if (isMounted) {
          setProperties(MOCK_PROPERTIES as any[]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    const timeoutId = setTimeout(() => {
      fetchProperties();
    }, 500);
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [filters, searchTerm]);

  return (
    <div className="prop-map-layout">
      {/* SIDEBAR: Search & List */}
      <aside className="prop-map-sidebar">
        <div className="prop-map-sidebar-header">
          <button className="prop-map-back-btn" onClick={() => navigate('/propiedades')}>
            <ArrowLeft size={20} />
            Volver a lista
          </button>
          <h2>Búsqueda en Mapa</h2>
          
          <div className="prop-map-filters">
            <div className="prop-map-search-wrapper">
              <Search className="prop-map-search-icon" size={18} />
              <input
                type="text"
                placeholder="Busca ciudad o zona..."
                className="prop-map-filter-input with-icon"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="prop-map-filter-row">
              <select
                className="prop-map-filter-select"
                value={filters.operationType || ''}
                onChange={(e) => setFilters((prev) => ({ ...prev, operationType: (e.target.value as OperationType) || undefined }))}
              >
                <option value="">Operación</option>
                <option value="sale">Venta</option>
                <option value="rent">Alquiler</option>
                <option value="anticretico">Anticrético</option>
              </select>
              <select
                className="prop-map-filter-select"
                value={filters.propertyType || ''}
                onChange={(e) => setFilters((prev) => ({ ...prev, propertyType: (e.target.value as PropertyType) || undefined }))}
              >
                <option value="">Inmueble</option>
                <option value="house">Casa</option>
                <option value="apartment">Dpto</option>
                <option value="land">Terreno</option>
                <option value="office">Oficina</option>
              </select>
            </div>
          </div>
          
          <div className="prop-map-results-count">
            {loading ? 'Buscando...' : `${properties.length} propiedades encontradas`}
          </div>
        </div>

        <div className="prop-map-list">
          {loading ? (
            <div className="prop-map-loading">
              <Loader2 className="spinner" size={40} />
            </div>
          ) : (
            properties.map((prop) => {
              const image = (prop as any).image || '/properties_hero.png';
              return (
                <div key={prop.id} className="prop-map-card">
                  <div className="prop-map-card-image" style={{ backgroundImage: `url(${image})` }}>
                    <span className={`prop-badge type-${prop.operationType}`}>{getOperationLabel(prop.operationType)}</span>
                  </div>
                  <div className="prop-map-card-body">
                    <div className="prop-map-card-price">{formatPrice(prop.price, prop.currency, prop.operationType)}</div>
                    <h3 className="prop-map-card-title">{prop.title}</h3>
                    <div className="prop-map-card-location">
                      <MapPin size={14} /> {prop.address}, {prop.city}
                    </div>
                    <div className="prop-map-card-features">
                      {(prop.bedrooms ?? 0) > 0 && <span><Bed size={14} /> {prop.bedrooms}</span>}
                      {(prop.bathrooms ?? 0) > 0 && <span><Bath size={14} /> {prop.bathrooms}</span>}
                      <span><Square size={14} /> {prop.areaTotal || prop.area || 0} m²</span>
                    </div>
                    {((prop as any).latitude && (prop as any).longitude) && (
                      <div className="prop-map-card-coords">
                        <span>Lat: {Number((prop as any).latitude).toFixed(4)}</span>
                        <span>Lng: {Number((prop as any).longitude).toFixed(4)}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>

      {/* MAIN: Map */}
      <main className="prop-map-main">
        {/* Using the legacy Google Maps embed which ignores cooperative scroll gestures */}
        <iframe 
          src="https://maps.google.com/maps?q=Cochabamba&t=m&z=13&output=embed&iwloc=near" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="Interactive Map"
        ></iframe>
      </main>
    </div>
  );
}
