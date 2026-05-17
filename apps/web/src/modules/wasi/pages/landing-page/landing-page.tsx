import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@core/constants/routes.constants';
import { Building2, Key, Home, Briefcase, Bot, FileSignature, ShieldCheck, BarChart3, CheckCircle2 } from 'lucide-react';
import { ChatModal, type ChatOperationType } from '@modules/chat/components/ChatModal';
import { propertyService } from '@modules/proptech/services/property.service';
import type { Property } from '@modules/proptech/types/property.types';
import './landing-page.css';

const OP_LABELS: Record<string, string> = { sale: 'Venta', rent: 'Alquiler', anticretico: 'Anticrético' };
const TYPE_LABELS: Record<string, string> = {
  house: 'Casa', apartment: 'Departamento', land: 'Terreno',
  office: 'Oficina', commercial: 'Comercial', warehouse: 'Almacén', parking: 'Estacionamiento',
};

function formatPrice(price: number, currency: string, op: string) {
  const fmt = new Intl.NumberFormat('es-BO', { style: 'currency', currency: currency || 'USD', maximumFractionDigits: 0 }).format(price);
  return op === 'rent' ? `${fmt}/mes` : fmt;
}

const SERVICES = [
  { id: 'compra',      title: 'Compra de propiedades', desc: 'Encuentra tu hogar ideal entre cientos de opciones verificadas.',  image: '/service_compra.png',      route: '/propiedades?operation=sale'        },
  { id: 'alquiler',   title: 'Alquiler',               desc: 'Propiedades en alquiler en las mejores zonas de Bolivia.',         image: '/service_alquiler.png',    route: '/propiedades?operation=rent'        },
  { id: 'anticretico',title: 'Anticrético',            desc: 'Modalidad boliviana de arrendamiento con capital.',                image: '/service_anticretico.png', route: '/propiedades?operation=anticretico' },
  { id: 'legal',      title: 'Asesoría legal',         desc: 'Revisión de contratos con IA y apoyo de profesionales.',          image: '/service_legal.png',       route: ROUTES.servicios                     },
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
  const [chatOp, setChatOp] = useState<ChatOperationType | null>(null);
  const [latestProps, setLatestProps] = useState<Property[]>([]);
  const [propsLoading, setPropsLoading] = useState(true);

  useEffect(() => {
    setPropsLoading(true);
    propertyService.findAllPublic({ publicationStatus: 'published', limit: 6 })
      .then((res) => setLatestProps(res.items))
      .catch(() => {})
      .finally(() => setPropsLoading(false));
  }, []);

  return (
    <div className="lp">
      {chatOp && <ChatModal operation={chatOp} onClose={() => setChatOp(null)} />}

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="lp-hero">
        <div className="lp-hero-bg" />
        <div className="lp-hero-content">
          {/* <span className="lp-hero-badge">🏡 La plataforma inmobiliaria #1 de Bolivia</span> */}
          <h1 className="lp-hero-title">
            Encuentra el hogar<br />
            <span className="lp-hero-accent">que mereces</span>
          </h1>
          <p className="lp-hero-subtitle">
            Más de 500 propiedades verificadas en Santa Cruz, Cochabamba y La Paz.
            Tecnología de punta para conectar compradores, vendedores y agentes.
          </p>
          <div className="lp-hero-action-cards">
            <button className="lp-action-card" onClick={() => navigate(ROUTES.login)}>
              <Building2 className="lp-action-icon-svg" strokeWidth={1.5} />
              <span className="lp-action-text">Quiero vender</span>
            </button>
            <button className="lp-action-card" onClick={() => setChatOp('compra')}>
              <Key className="lp-action-icon-svg" strokeWidth={1.5} />
              <span className="lp-action-text">Quiero comprar</span>
            </button>
            <button className="lp-action-card" onClick={() => setChatOp('alquiler')}>
              <Home className="lp-action-icon-svg" strokeWidth={1.5} />
              <span className="lp-action-text">Quiero alquilar</span>
            </button>
            <button className="lp-action-card" onClick={() => setChatOp('anticretico')}>
              <Briefcase className="lp-action-icon-svg" strokeWidth={1.5} />
              <span className="lp-action-text">Quiero un anticrético</span>
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

      {/* ── Latest properties ─────────────────────────────── */}
      <section className="lp-section">
        <div className="lp-section-inner">
          <div className="lp-section-header">
            <div>
              <span className="lp-section-eyebrow">Propiedades</span>
              <h2 className="lp-section-title">Últimas publicaciones</h2>
            </div>
            <button className="lp-btn-ghost" onClick={() => navigate(ROUTES.propiedades)}>
              Ver todas →
            </button>
          </div>

          <div className="lp-properties-grid">
            {propsLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="lp-prop-card lp-prop-skeleton">
                    <div className="lp-prop-skeleton-img" />
                    <div className="lp-prop-body">
                      <div className="lp-skeleton-line lp-skeleton-line--short" />
                      <div className="lp-skeleton-line" />
                      <div className="lp-skeleton-line lp-skeleton-line--mid" />
                    </div>
                  </div>
                ))
              : latestProps.map((p) => {
                  const img = p.imageUrls && p.imageUrls.length > 0 ? p.imageUrls[0] : null;
                  const opLabel = OP_LABELS[p.operationType] ?? p.operationType;
                  const typeLabel = TYPE_LABELS[p.propertyType] ?? p.propertyType;
                  return (
                    <div key={p.id} className="lp-prop-card" onClick={() => navigate(`/propiedades/${p.id}`)}>
                      <div className="lp-prop-media">
                        {img
                          ? <img src={img} alt={p.title} className="lp-prop-img" onError={(e) => { (e.target as HTMLImageElement).src = '/properties_hero.png'; }} />
                          : <span className="lp-prop-emoji">🏠</span>
                        }
                        {p.isFeatured && <span className="lp-prop-badge">Destacado</span>}
                        <span className="lp-prop-op-tag">{opLabel}</span>
                      </div>
                      <div className="lp-prop-body">
                        <div className="lp-prop-type">{typeLabel} · {p.city}</div>
                        <h3 className="lp-prop-title">{p.title}</h3>
                        <div className="lp-prop-meta">
                          {(p.bedrooms ?? 0) > 0 && <span>🛏 {p.bedrooms} dorm.</span>}
                          {(p.areaTotal ?? 0) > 0 && <span>📐 {p.areaTotal} m²</span>}
                          {p.zone && <span>📍 {p.zone}</span>}
                        </div>
                        <div className="lp-prop-footer">
                          <span className="lp-prop-price">{formatPrice(p.price, p.currency, p.operationType)}</span>
                          <button
                            className="lp-prop-cta"
                            onClick={(e) => { e.stopPropagation(); navigate(`/propiedades/${p.id}`); }}
                          >
                            Ver más
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
            }
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
              WASI cubre todas las modalidades del mercado inmobiliario boliviano
            </p>
          </div>

          <div className="lp-services-grid">
            {SERVICES.map((s) => (
              <div key={s.id} className="lp-service-card" style={{ backgroundImage: `url(${s.image})` }} onClick={() => navigate(s.route)}>
                <div className="lp-service-overlay" />
                <div className="lp-service-content">
                  <h3 className="lp-service-title">{s.title}</h3>
                  <p className="lp-service-desc">{s.desc}</p>
                  <span className="lp-service-link">Explorar</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why WASI ──────────────────────────────────── */}
      <section className="lp-section">
        <div className="lp-section-inner lp-why">
          <div className="lp-why-left">
            <span className="lp-section-eyebrow">¿Por qué elegirnos?</span>
            <h2 className="lp-section-title">WASI PropTech</h2>
            <p className="lp-why-intro">
              Somos la plataforma tecnológica más completa del mercado inmobiliario boliviano,
              con 12 años de experiencia y más de 2,000 transacciones exitosas.
            </p>
            <ul className="lp-why-list">
              {WHY_ITEMS.map((item) => (
                <li key={item}>
                  <CheckCircle2 className="lp-why-check-icon" strokeWidth={2} size={20} />
                  {item}
                </li>
              ))}
            </ul>
            <button className="lp-btn-primary" onClick={() => navigate(ROUTES.login)}>
              Comenzar ahora
            </button>
          </div>
          <div className="lp-why-right">
            <div className="lp-why-card lp-why-card--image" style={{ backgroundImage: "url('/landing_why_matching.png')" }}>
              <div className="lp-why-card-overlay" />
              <div className="lp-why-card-body">
                <strong>Matching con IA</strong>
                <span>Encontramos la propiedad ideal según tu perfil y presupuesto</span>
              </div>
            </div>
            <div className="lp-why-card lp-why-card--image" style={{ backgroundImage: "url('/landing_why_contracts.png')" }}>
              <div className="lp-why-card-overlay" />
              <div className="lp-why-card-body">
                <strong>Contratos inteligentes</strong>
                <span>IA revisa y detecta cláusulas de riesgo en segundos</span>
              </div>
            </div>
            <div className="lp-why-card lp-why-card--image" style={{ backgroundImage: "url('/landing_why_verified.png')" }}>
              <div className="lp-why-card-overlay" />
              <div className="lp-why-card-body">
                <strong>Propiedades verificadas</strong>
                <span>Documentación legal auditada antes de publicar</span>
              </div>
            </div>
            <div className="lp-why-card lp-why-card--image" style={{ backgroundImage: "url('/landing_why_reports.png')" }}>
              <div className="lp-why-card-overlay" />
              <div className="lp-why-card-body">
                <strong>Reportes en tiempo real</strong>
                <span>Agentes y administradores con datos actualizados siempre</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Roles section ─────────────────────────────────── */}
      <section className="lp-section lp-section--dark">
        <div className="lp-section-inner">
          <div className="lp-section-header centered">
            <span className="lp-section-eyebrow">Plataforma multi-rol</span>
            <h2 className="lp-section-title text-white">Un portal para cada perfil</h2>
          </div>
          <div className="lp-roles-grid">
            <div className="lp-role-card" style={{ backgroundImage: 'url(/role_agente.png)' }} onClick={() => navigate(ROUTES.agente)}>
              <div className="lp-role-overlay" />
              <div className="lp-role-content">
                <h3>Soy Agente</h3>
                <span className="lp-role-link">Explorar →</span>
              </div>
            </div>
            <div className="lp-role-card" style={{ backgroundImage: 'url(/role_propietario.png)' }} onClick={() => navigate(ROUTES.propietario)}>
              <div className="lp-role-overlay" />
              <div className="lp-role-content">
                <h3>Soy Propietario</h3>
                <span className="lp-role-link">Explorar →</span>
              </div>
            </div>
            <div className="lp-role-card" style={{ backgroundImage: 'url(/role_comprador.png)' }} onClick={() => setChatOp('compra')}>
              <div className="lp-role-overlay" />
              <div className="lp-role-content">
                <h3>Soy Comprador</h3>
                <span className="lp-role-link">Explorar →</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="lp-cta">
        <div className="lp-cta-inner">
          <h2>¿Listo para encontrar tu propiedad ideal?</h2>
          <p>Únete a más de 5,000 familias que confiaron en WASI para encontrar su hogar</p>
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
