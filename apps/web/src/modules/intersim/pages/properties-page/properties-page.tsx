import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@core/constants/routes.constants';
import { MapPin, Bed, Bath, Square, ArrowRight } from 'lucide-react';
import './properties-page.css';

const MOCK_PROPERTIES = [
  { id: 1, title: 'Villa Moderna', type: 'Venta', price: '$450,000', location: 'Urubó, Santa Cruz', beds: 4, baths: 3, sqft: 350, image: '/properties_hero.png' },
  { id: 2, title: 'Penthouse Ejecutivo', type: 'Anticrético', price: '$50,000', location: 'Equipetrol, Santa Cruz', beds: 2, baths: 2, sqft: 150, image: '/service_alquiler.png' },
  { id: 3, title: 'Casa Familiar', type: 'Venta', price: '$220,000', location: 'Cala Cala, Cochabamba', beds: 3, baths: 2, sqft: 200, image: '/service_compra.png' },
  { id: 4, title: 'Departamento de Lujo', type: 'Alquiler', price: '$800/mes', location: 'Calacoto, La Paz', beds: 2, baths: 2, sqft: 120, image: '/service_anticretico.png' },
  { id: 5, title: 'Terreno Comercial', type: 'Venta', price: '$150,000', location: 'Zona Norte, Santa Cruz', beds: 0, baths: 0, sqft: 500, image: '/hero-bg.png' },
  { id: 6, title: 'Condominio Exclusivo', type: 'Venta', price: '$310,000', location: 'Tiquipaya, Cochabamba', beds: 4, baths: 4, sqft: 280, image: '/properties_hero.png' },
];

export function PropertiesPage() {
  const navigate = useNavigate();

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
            <input type="text" placeholder="Buscar por ciudad, zona..." className="prop-filter-input" />
            <select className="prop-filter-select">
              <option>Tipo de Operación</option>
              <option>Venta</option>
              <option>Alquiler</option>
              <option>Anticrético</option>
            </select>
            <select className="prop-filter-select">
              <option>Tipo de Inmueble</option>
              <option>Casa</option>
              <option>Departamento</option>
              <option>Terreno</option>
              <option>Oficina</option>
            </select>
            <button className="prop-filter-btn">Buscar</button>
          </div>

          <div className="properties-grid">
            {MOCK_PROPERTIES.map((prop) => (
              <div key={prop.id} className="prop-card">
                <div className="prop-card-image" style={{ backgroundImage: `url(${prop.image})` }}>
                  <span className={`prop-badge type-${prop.type.toLowerCase()}`}>{prop.type}</span>
                  <div className="prop-price">{prop.price}</div>
                </div>
                <div className="prop-card-body">
                  <h3 className="prop-title">{prop.title}</h3>
                  <div className="prop-location">
                    <MapPin size={16} /> {prop.location}
                  </div>
                  <div className="prop-features">
                    {prop.beds > 0 && <span className="prop-feature"><Bed size={16} /> {prop.beds}</span>}
                    {prop.baths > 0 && <span className="prop-feature"><Bath size={16} /> {prop.baths}</span>}
                    <span className="prop-feature"><Square size={16} /> {prop.sqft} m²</span>
                  </div>
                  <button className="prop-card-btn" onClick={() => navigate(ROUTES.login)}>
                    Ver detalles <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
