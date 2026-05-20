import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, BadgeCheck, BarChart3, Bot, Brain, Building2,
  CheckCircle2, ChevronRight, ClipboardList, Home, Layers,
  MessageSquare, ShieldCheck, Sparkles, Star, TrendingUp, Users, Zap,
} from 'lucide-react';
import { ROUTES } from '@core/constants/routes.constants';
import './agent-promo-page.css';

/* ── Plans ──────────────────────────────────────────────────── */

const PLANS = [
  {
    id: 'basico',
    name: 'Básico',
    price: 40,
    color: '#64748b',
    accent: 'ap-plan--basic',
    properties: 5,
    reports: 'Mensuales',
    features: [
      { label: '5 propiedades activas', ok: true },
      { label: 'Agente IA para contratos (básico)', ok: true },
      { label: 'Reportes mensuales', ok: true },
      { label: 'Perfil de agente verificado', ok: true },
      { label: 'Soporte por email', ok: true },
      { label: 'Reportes semanales', ok: false },
      { label: 'Recomendaciones IA a clientes', ok: false },
      { label: 'Análisis de mercado avanzado', ok: false },
      { label: 'CRM avanzado integrado', ok: false },
      { label: 'Campañas de marketing digital', ok: false },
    ],
  },
  {
    id: 'platino',
    name: 'Platino',
    price: 60,
    color: '#7c3aed',
    accent: 'ap-plan--platino',
    properties: 10,
    reports: 'Semanales',
    recommended: true,
    features: [
      { label: '10 propiedades activas', ok: true },
      { label: 'Agente IA para contratos (avanzado)', ok: true },
      { label: 'Reportes semanales', ok: true },
      { label: 'Recomendaciones IA a clientes', ok: true },
      { label: 'Perfil destacado en búsquedas', ok: true },
      { label: 'Soporte prioritario', ok: true },
      { label: 'Análisis de mercado avanzado', ok: true },
      { label: 'CRM avanzado integrado', ok: false },
      { label: 'Campañas de marketing digital', ok: false },
    ],
  },
  {
    id: 'diamante',
    name: 'Diamante',
    price: 100,
    color: '#0ea5e9',
    accent: 'ap-plan--diamante',
    properties: 15,
    reports: 'Semanales + Analítica avanzada',
    features: [
      { label: '15 propiedades activas', ok: true },
      { label: 'Agente IA completo (contratos + docs)', ok: true },
      { label: 'Reportes semanales + analítica avanzada', ok: true },
      { label: 'Recomendaciones IA premium', ok: true },
      { label: 'Badge de Agente Premium visible', ok: true },
      { label: 'Soporte 24/7 dedicado', ok: true },
      { label: 'Análisis de mercado en tiempo real', ok: true },
      { label: 'CRM avanzado integrado', ok: true },
      { label: 'Campañas de marketing digital', ok: true },
    ],
  },
];

const PLATFORM_FEATURES = [
  { icon: Bot, title: 'Agente IA de Contratos', text: 'Nuestro agente analiza y corrige automáticamente cláusulas problemáticas en contratos de compra, alquiler o anticrético.', color: 'blue' },
  { icon: Brain, title: 'Recomendaciones Inteligentes', text: 'Cuando un cliente busca propiedad, la IA te sugiere como agente ideal según tu portafolio y zona de especialización.', color: 'purple' },
  { icon: BarChart3, title: 'Reportes Detallados', text: 'Accede a reportes de rendimiento, tasas de cierre, tiempo medio de venta y comparativas con el mercado.', color: 'emerald' },
  { icon: Users, title: 'CRM Integrado', text: 'Gestiona todos tus leads, clientes activos, visitas y seguimientos desde un solo panel intuitivo.', color: 'amber' },
  { icon: Zap, title: 'Campañas de Marketing', text: 'Crea y distribuye campañas automáticas por WhatsApp, email y redes sociales para tus propiedades.', color: 'rose' },
  { icon: ShieldCheck, title: 'Perfil Verificado', text: 'Tu perfil aparece con badge de verificación que transmite confianza y credibilidad a los compradores.', color: 'teal' },
];

const WHY_ROWS = [
  {
    side: 'left',
    image: '/agent_promo_deals.png',
    icon: TrendingUp,
    iconColor: 'blue',
    title: 'Más cierres, menos esfuerzo',
    text: 'La plataforma conecta automáticamente tu portafolio con clientes que ya buscan exactamente lo que tienes. El motor de matching analiza 50+ variables para enviarte leads calificados antes de que los busques tú.',
    bullets: ['Leads calificados por IA', 'Matching automático por zona y presupuesto', 'Notificaciones en tiempo real'],
  },
  {
    side: 'right',
    image: '/agent_promo_contracts.png',
    icon: ClipboardList,
    iconColor: 'purple',
    title: 'Contratos que se defienden solos',
    text: 'Olvida revisar páginas de texto legal. Sube el contrato y en segundos el agente IA detecta cláusulas ambiguas, condiciones desfavorables y errores antes de que lleguen al cliente.',
    bullets: ['Revisión en < 30 segundos', 'Correcciones sugeridas con alternativas', 'Compatible con contratos de venta, alquiler y anticrético'],
  },
  {
    side: 'left',
    image: '/agent_promo_dashboard.png',
    icon: Layers,
    iconColor: 'emerald',
    title: 'Panel de control profesional',
    text: 'Visualiza el rendimiento de tus propiedades, tasa de conversión, historial de visitas y estadísticas del mercado. Todo en un dashboard limpio que funciona en escritorio y móvil.',
    bullets: ['KPIs en tiempo real', 'Histórico de operaciones', 'Comparativa con el mercado local'],
  },
];

/* ── Component ──────────────────────────────────────────────── */

export function AgentPromoPage() {
  const navigate = useNavigate();
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('in-view');
        });
      },
      { threshold: 0.1 },
    );
    document.querySelectorAll('.anim-scroll').forEach((el) => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <main className="ap-page">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="ap-hero">
        <div className="ap-hero__bg" />
        <div className="ap-hero__overlay" />

        <div className="ap-hero__orb ap-hero__orb--1" />
        <div className="ap-hero__orb ap-hero__orb--2" />
        <div className="ap-hero__orb ap-hero__orb--3" />

        <div className="ap-hero__content">
          <div className="ap-hero__eyebrow">
            <Star size={14} />
            Únete a la red de agentes líderes en Bolivia
          </div>
          <h1 className="ap-hero__title">
            Potencia tu carrera como<br />
            <span className="ap-hero__title-accent">Agente Inmobiliario</span>
          </h1>
          <p className="ap-hero__sub">
            Tecnología de punta, inteligencia artificial y un ecosistema completo
            para que cierres más operaciones, en menos tiempo y con mayor confianza.
          </p>
          <div className="ap-hero__actions">
            <a href="#pricing" className="ap-btn ap-btn--primary">
              Ver planes y precios <ChevronRight size={18} />
            </a>
            <a href="#features" className="ap-btn ap-btn--glass">
              Descubrir plataforma <ArrowRight size={18} />
            </a>
          </div>
        </div>

        {/* <div className="ap-hero__badges">
          <div className="ap-hero__badge ap-hero__badge--1">
            <Home size={20} />
            <div>
              <strong>500+</strong>
              <span>Propiedades activas</span>
            </div>
          </div>
          <div className="ap-hero__badge ap-hero__badge--2">
            <Users size={20} />
            <div>
              <strong>50+</strong>
              <span>Agentes certificados</span>
            </div>
          </div>
          <div className="ap-hero__badge ap-hero__badge--3">
            <Sparkles size={20} />
            <div>
              <strong>IA</strong>
              <span>Tecnología de punta</span>
            </div>
          </div>
        </div> */}

        <div className="ap-hero__scroll-hint" aria-hidden="true">
          <span />
        </div>
      </section>

      {/* ── Why Join ─────────────────────────────────────── */}
      <section className="ap-why" id="features">
        <div className="ap-section-head anim-scroll">
          <span>¿Por qué elegirnos?</span>
          <h2>¿Quieres trabajar con nosotros?<br />Descubre todas nuestras facilidades</h2>
          <p>Una plataforma diseñada por y para agentes inmobiliarios modernos. Todo lo que necesitas para crecer.</p>
        </div>

        {WHY_ROWS.map((row, i) => (
          <div
            key={row.title}
            className={`ap-why__row anim-scroll anim-scroll--${row.side === 'left' ? 'left' : 'right'}`}
            style={{ animationDelay: `${i * 0.15}s` }}
          >
            {row.side === 'left' && (
              <div className="ap-why__image-wrap">
                <img src={row.image} alt={row.title} className="ap-why__image" loading="lazy" />
              </div>
            )}
            <div className="ap-why__content">
              <div className={`ap-why__icon-wrap icon-${row.iconColor}`}>
                <row.icon size={26} />
              </div>
              <h3>{row.title}</h3>
              <p>{row.text}</p>
              <ul className="ap-why__bullets">
                {row.bullets.map((b) => (
                  <li key={b}><CheckCircle2 size={16} /> {b}</li>
                ))}
              </ul>
            </div>
            {row.side === 'right' && (
              <div className="ap-why__image-wrap ap-why__image-wrap--right">
                <img src={row.image} alt={row.title} className="ap-why__image" loading="lazy" />
              </div>
            )}
          </div>
        ))}
      </section>

      {/* ── Platform Features ────────────────────────────── */}
      <section className="ap-features">
        <div className="ap-features__inner">
          <div className="ap-section-head ap-section-head--center anim-scroll">
            <span>Lo que tienes con nosotros</span>
            <h2>Todo lo que necesitas para<br />cerrar más operaciones</h2>
          </div>
          <div className="ap-features__grid">
            {PLATFORM_FEATURES.map((f, i) => (
              <article
                key={f.title}
                className={`ap-feature-card anim-scroll`}
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <div className={`ap-feature-card__icon icon-${f.color}`}>
                  <f.icon size={28} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────── */}
      <section className="ap-pricing" id="pricing">
        <div className="ap-pricing__inner">
          <div className="ap-section-head ap-section-head--center anim-scroll">
            <span>Planes y precios</span>
            <h2>Elige el plan que impulsa<br />tu carrera este mes</h2>
            <p>Todos los planes duran 1 mes y se renuevan automáticamente. Cancela cuando quieras.</p>
          </div>

          <div className="ap-plans">
            {PLANS.map((plan, i) => (
              <article
                key={plan.id}
                className={`ap-plan ${plan.accent} anim-scroll`}
                style={{ transitionDelay: `${i * 0.12}s` }}
              >
                {plan.recommended && (
                  <div className="ap-plan__badge">
                    <Star size={12} /> Más popular
                  </div>
                )}
                <div className="ap-plan__head">
                  <h3 className="ap-plan__name">{plan.name}</h3>
                  <div className="ap-plan__price">
                    <strong>${plan.price}</strong>
                    <span>/ mes</span>
                  </div>
                  <div className="ap-plan__props">
                    <Building2 size={15} />
                    Hasta <strong>{plan.properties} propiedades</strong> activas
                  </div>
                  <div className="ap-plan__reports">
                    <BarChart3 size={15} />
                    Reportes <strong>{plan.reports}</strong>
                  </div>
                </div>

                <ul className="ap-plan__features">
                  {plan.features.map((feat) => (
                    <li
                      key={feat.label}
                      className={feat.ok ? 'ap-plan__feat--on' : 'ap-plan__feat--off'}
                    >
                      {feat.ok
                        ? <CheckCircle2 size={15} />
                        : <span className="ap-plan__x">✕</span>}
                      {feat.label}
                    </li>
                  ))}
                </ul>

                <button
                  className="ap-plan__cta"
                  onClick={() => navigate(`${ROUTES.agentePago}/${plan.id}`)}
                >
                  Suscribirme al plan {plan.name}
                  <ArrowRight size={16} />
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────── */}
      <section className="ap-cta-band anim-scroll">
        <div className="ap-cta-band__inner">
          <BadgeCheck size={48} className="ap-cta-band__icon" />
          <h2>Únete hoy y empieza a cerrar más en menos tiempo</h2>
          <p>Sin permanencia mínima. Cancela cuando quieras. Soporte en español desde Bolivia.</p>
          <a href="#pricing" className="ap-btn ap-btn--cta">
            Ver todos los planes <ChevronRight size={18} />
          </a>
        </div>
      </section>

    </main>
  );
}
