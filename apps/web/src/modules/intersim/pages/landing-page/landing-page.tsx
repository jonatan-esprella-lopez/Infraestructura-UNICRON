import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@core/constants/routes.constants';
import './landing-page.css';

const FEATURED = [
  {
    id: 1,
    title: 'Departamento en Equipetrol',
    type: 'Departamento',
    operation: 'Venta',
    price: '$us 145,000',
    bedrooms: 3,
    area: '120 m²',
    city: 'Santa Cruz',
    zone: 'Equipetrol Norte',
    badge: 'Destacado',
    emoji: '🏢',
  },
  {
    id: 2,
    title: 'Casa residencial en Las Palmas',
    type: 'Casa',
    operation: 'Venta',
    price: '$us 280,000',
    bedrooms: 4,
    area: '320 m²',
    city: 'Santa Cruz',
    zone: 'Las Palmas',
    badge: 'Nuevo',
    emoji: '🏡',
  },
  {
    id: 3,
    title: 'Oficina en Torre Empresarial',
    type: 'Oficina',
    operation: 'Alquiler',
    price: '$us 1,800/mes',
    bedrooms: 0,
    area: '85 m²',
    city: 'Santa Cruz',
    zone: 'Centro Empresarial',
    badge: null,
    emoji: '🏙️',
  },
  {
    id: 4,
    title: 'Penthouse Bello Horizonte',
    type: 'Penthouse',
    operation: 'Anticrético',
    price: 'Bs. 120,000',
    bedrooms: 3,
    area: '200 m²',
    city: 'Cochabamba',
    zone: 'Bello Horizonte',
    badge: 'Premium',
    emoji: '🌆',
  },
  {
    id: 5,
    title: 'Terreno urbanizado en Warnes',
    type: 'Terreno',
    operation: 'Venta',
    price: '$us 35,000',
    bedrooms: 0,
    area: '500 m²',
    city: 'Santa Cruz',
    zone: 'Warnes',
    badge: null,
    emoji: '🌱',
  },
  {
    id: 6,
    title: 'Dpto. amoblado San Miguel',
    type: 'Departamento',
    operation: 'Alquiler',
    price: '$us 650/mes',
    bedrooms: 2,
    area: '75 m²',
    city: 'Santa Cruz',
    zone: 'San Miguel',
    badge: 'Amoblado',
    emoji: '🏠',
  },
];

const SERVICES = [
  { icon: '🏠', title: 'Compra de propiedades', desc: 'Encuentra tu hogar ideal entre cientos de opciones verificadas.' },
  { icon: '🔑', title: 'Alquiler', desc: 'Propiedades en alquiler en las mejores zonas de Bolivia.' },
  { icon: '💰', title: 'Anticrético', desc: 'Modalidad boliviana de arrendamiento con capital.' },
  { icon: '⚖️', title: 'Asesoría legal', desc: 'Revisión de contratos con IA y apoyo de profesionales.' },
];

const STATS = [
  { value: '500+', label: 'Propiedades' },
  { value: '50+', label: 'Agentes certificados' },
  { value: '12', label: 'Años en el mercado' },
  { value: '98%', label: 'Clientes satisfechos' },
];

const WHY_ITEMS = [
  'Agentes certificados y verificados en toda Bolivia',
  'Matching inteligente entre compradores y propiedades',
  'Revisión de contratos con inteligencia artificial',
  'Portal personalizado según tu rol (comprador, vendedor, agente)',
  'Cobertura en Santa Cruz, Cochabamba y La Paz',
  'Soporte dedicado durante todo el proceso de compra',
];

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="lp">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="lp-hero">
        <div className="lp-hero-bg" />
        <div className="lp-hero-content">
          <span className="lp-hero-badge">🏡 La plataforma inmobiliaria #1 de Bolivia</span>
          <h1 className="lp-hero-title">
            Encuentra el hogar<br />
            <span className="lp-hero-accent">que mereces</span>
          </h1>
          <p className="lp-hero-subtitle">
            Más de 500 propiedades verificadas en Santa Cruz, Cochabamba y La Paz.
            Tecnología de punta para conectar compradores, vendedores y agentes.
          </p>
          <div className="lp-hero-actions">
            <button className="lp-btn-primary" onClick={() => navigate(ROUTES.login)}>
              Buscar propiedades
            </button>
            <button className="lp-btn-outline" onClick={() => navigate(ROUTES.login)}>
              Soy agente / propietario →
            </button>
          </div>
        </div>

        <div className="lp-hero-stats">
          {STATS.map((s) => (
            <div key={s.label} className="lp-stat">
              <span className="lp-stat-value">{s.value}</span>
              <span className="lp-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured properties ───────────────────────────── */}
      <section className="lp-section">
        <div className="lp-section-inner">
          <div className="lp-section-header">
            <div>
              <span className="lp-section-eyebrow">Propiedades</span>
              <h2 className="lp-section-title">Destacadas esta semana</h2>
            </div>
            <button className="lp-btn-ghost" onClick={() => navigate(ROUTES.login)}>
              Ver todas →
            </button>
          </div>

          <div className="lp-properties-grid">
            {FEATURED.map((p) => (
              <div key={p.id} className="lp-prop-card" onClick={() => navigate(ROUTES.login)}>
                <div className="lp-prop-media">
                  <span className="lp-prop-emoji">{p.emoji}</span>
                  {p.badge && <span className="lp-prop-badge">{p.badge}</span>}
                  <span className="lp-prop-op-tag">{p.operation}</span>
                </div>
                <div className="lp-prop-body">
                  <div className="lp-prop-type">{p.type} · {p.city}</div>
                  <h3 className="lp-prop-title">{p.title}</h3>
                  <div className="lp-prop-meta">
                    {p.bedrooms > 0 && <span>🛏 {p.bedrooms} dorm.</span>}
                    <span>📐 {p.area}</span>
                    <span>📍 {p.zone}</span>
                  </div>
                  <div className="lp-prop-footer">
                    <span className="lp-prop-price">{p.price}</span>
                    <button className="lp-prop-cta">Ver más</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ──────────────────────────────────────── */}
      <section className="lp-section lp-section--alt">
        <div className="lp-section-inner">
          <div className="lp-section-header centered">
            <span className="lp-section-eyebrow">Servicios</span>
            <h2 className="lp-section-title">¿Qué estás buscando?</h2>
            <p className="lp-section-desc">
              INTERSIM cubre todas las modalidades del mercado inmobiliario boliviano
            </p>
          </div>

          <div className="lp-services-grid">
            {SERVICES.map((s) => (
              <div key={s.title} className="lp-service-card" onClick={() => navigate(ROUTES.login)}>
                <div className="lp-service-icon">{s.icon}</div>
                <h3 className="lp-service-title">{s.title}</h3>
                <p className="lp-service-desc">{s.desc}</p>
                <span className="lp-service-link">Explorar →</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why INTERSIM ──────────────────────────────────── */}
      <section className="lp-section">
        <div className="lp-section-inner lp-why">
          <div className="lp-why-left">
            <span className="lp-section-eyebrow">¿Por qué elegirnos?</span>
            <h2 className="lp-section-title">INTERSIM PropTech</h2>
            <p className="lp-why-intro">
              Somos la plataforma tecnológica más completa del mercado inmobiliario boliviano,
              con 12 años de experiencia y más de 2,000 transacciones exitosas.
            </p>
            <ul className="lp-why-list">
              {WHY_ITEMS.map((item) => (
                <li key={item}>
                  <span className="lp-why-check">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <button className="lp-btn-primary" onClick={() => navigate(ROUTES.login)}>
              Comenzar ahora
            </button>
          </div>
          <div className="lp-why-right">
            <div className="lp-why-card lp-why-card--1">
              <div className="lp-why-card-icon">🤖</div>
              <div className="lp-why-card-body">
                <strong>Matching con IA</strong>
                <span>Encontramos la propiedad ideal según tu perfil y presupuesto</span>
              </div>
            </div>
            <div className="lp-why-card lp-why-card--2">
              <div className="lp-why-card-icon">📋</div>
              <div className="lp-why-card-body">
                <strong>Contratos inteligentes</strong>
                <span>IA revisa y detecta cláusulas de riesgo en segundos</span>
              </div>
            </div>
            <div className="lp-why-card lp-why-card--3">
              <div className="lp-why-card-icon">🔒</div>
              <div className="lp-why-card-body">
                <strong>Propiedades verificadas</strong>
                <span>Documentación legal auditada antes de publicar</span>
              </div>
            </div>
            <div className="lp-why-card lp-why-card--4">
              <div className="lp-why-card-icon">📊</div>
              <div className="lp-why-card-body">
                <strong>Reportes en tiempo real</strong>
                <span>Agentes y administradores con datos actualizados siempre</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Roles section ─────────────────────────────────── */}
      <section className="lp-section lp-section--alt">
        <div className="lp-section-inner">
          <div className="lp-section-header centered">
            <span className="lp-section-eyebrow">Plataforma multi-rol</span>
            <h2 className="lp-section-title">Un portal para cada perfil</h2>
          </div>
          <div className="lp-roles-grid">
            <div className="lp-role-card lp-role-card--admin">
              <div className="lp-role-icon">👨‍💼</div>
              <h3>Administradores</h3>
              <p>Dashboard completo con KPIs, gestión de agentes, reportes financieros y control total de la plataforma.</p>
              <button onClick={() => navigate(ROUTES.login)}>Acceder como Admin</button>
            </div>
            <div className="lp-role-card lp-role-card--agent">
              <div className="lp-role-icon">🏃</div>
              <h3>Agentes</h3>
              <p>Gestión de cartera, visitas del día, clientes urgentes y matching IA para cerrar más ventas.</p>
              <button onClick={() => navigate(ROUTES.login)}>Acceder como Agente</button>
            </div>
            <div className="lp-role-card lp-role-card--owner">
              <div className="lp-role-icon">🏠</div>
              <h3>Propietarios</h3>
              <p>Estado de tus propiedades, visitas programadas, ofertas recibidas y gestión de contratos.</p>
              <button onClick={() => navigate(ROUTES.login)}>Acceder como Propietario</button>
            </div>
            <div className="lp-role-card lp-role-card--client">
              <div className="lp-role-icon">🔍</div>
              <h3>Compradores</h3>
              <p>Búsqueda inteligente, recomendaciones personalizadas y seguimiento de tu proceso de compra.</p>
              <button onClick={() => navigate(ROUTES.login)}>Buscar propiedades</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="lp-cta">
        <div className="lp-cta-inner">
          <h2>¿Listo para encontrar tu propiedad ideal?</h2>
          <p>Únete a más de 5,000 familias que confiaron en INTERSIM para encontrar su hogar</p>
          <div className="lp-cta-actions">
            <button className="lp-btn-white" onClick={() => navigate(ROUTES.login)}>
              Buscar propiedades
            </button>
            <button className="lp-btn-outline-white" onClick={() => navigate(ROUTES.login)}>
              Hablar con un agente
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
