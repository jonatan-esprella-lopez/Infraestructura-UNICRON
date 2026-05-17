import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  BarChart3,
  Bot,
  Camera,
  CheckCircle2,
  ChevronDown,
  Clock,
  FileSignature,
  HeartHandshake,
  MapPin,
  Search,
  Shield,
  Star,
  TrendingUp,
  UserCheck,
} from 'lucide-react';
import { ROUTES } from '@core/constants/routes.constants';
import './propietario-page.css';

const BENEFITS = [
  { Icon: UserCheck, title: 'Agentes certificados', desc: 'Todos nuestros asesores pasan por un proceso riguroso de verificación, capacitación y certificación continua.' },
  { Icon: Bot,       title: 'IA revisa tus contratos', desc: 'Nuestra inteligencia artificial detecta cláusulas de riesgo en segundos antes de que firmes cualquier documento.' },
  { Icon: Shield,    title: 'Documentación verificada', desc: 'Auditamos la documentación legal de cada propiedad antes de publicarla — sin sorpresas ni fraudes.' },
  { Icon: MapPin,    title: 'Cobertura nacional', desc: 'Presencia consolidada en Santa Cruz, Cochabamba, La Paz, Oruro y Sucre.' },
  { Icon: BarChart3, title: 'Portal en tiempo real', desc: 'Ve el estado de tu propiedad, visitas agendadas y ofertas recibidas desde tu dashboard personal.' },
  { Icon: Clock,     title: 'Soporte dedicado', desc: 'Acompañamiento desde la publicación hasta la firma del contrato. Nunca estarás solo en el proceso.' },
];

const TOOLS = [
  {
    Icon: TrendingUp,
    title: 'Avalúa tu propiedad',
    desc: 'Descubre el valor real de tu inmueble con nuestra IA entrenada en datos del mercado boliviano.',
    cta: 'Avaluar ahora',
    route: ROUTES.avaluoPropiedad,
    color: '#2563eb',
  },
  {
    Icon: FileSignature,
    title: 'Contratos seguros',
    desc: 'Genera, revisa y firma contratos de venta y alquiler con respaldo legal e inteligencia artificial.',
    cta: 'Explorar servicios',
    route: ROUTES.servicios,
    color: '#7c3aed',
  },
  {
    Icon: Search,
    title: 'Matching con compradores',
    desc: 'Nuestro algoritmo conecta tu propiedad con los compradores más compatibles del sistema automáticamente.',
    cta: 'Ver propiedades',
    route: ROUTES.propiedades,
    color: '#0891b2',
  },
  {
    Icon: BarChart3,
    title: 'Portal de seguimiento',
    desc: 'Accede a tu dashboard con estadísticas, visitas y el estado de tu propiedad en tiempo real.',
    cta: 'Ir a mi portal',
    route: ROUTES.login,
    color: '#16a34a',
  },
];

const STEPS = [
  {
    num: '01',
    Icon: UserCheck,
    title: 'Te registras',
    desc: 'Crea tu cuenta gratis en minutos. Solo necesitas tu nombre, correo y teléfono.',
    detail: 'Sin costos ocultos. Sin contratos forzosos.',
  },
  {
    num: '02',
    Icon: Camera,
    title: 'Subes tu propiedad',
    desc: 'Agrega fotos, descripción, precio y documentación. Nuestro sistema verifica todo automáticamente.',
    detail: 'El proceso completo tarda menos de 10 minutos.',
  },
  {
    num: '03',
    Icon: HeartHandshake,
    title: 'Selecciona tu asesor',
    desc: 'Elige entre 30+ asesores certificados. Tu asesor gestiona visitas, ofertas y contratos por ti.',
    detail: 'Tú solo apruebas. El asesor hace el resto.',
  },
];

const TESTIMONIALS = [
  {
    name: 'María Fernanda Rojas',
    city: 'Santa Cruz',
    text: 'Vendí mi departamento en menos de 3 semanas. El asesor fue increíble y la IA me ayudó a revisar el contrato antes de firmar. 100% recomendado.',
    rating: 5,
  },
  {
    name: 'Carlos Mendoza',
    city: 'Cochabamba',
    text: 'Tenía miedo de poner mi casa en anticrético sin conocer bien el proceso legal. INTERSIM me dio seguridad y transparencia en cada paso.',
    rating: 5,
  },
  {
    name: 'Lucía Vargas',
    city: 'La Paz',
    text: 'El avalúo inteligente me sorprendió — el precio coincidió exactamente con lo que ofrecieron los compradores. Tecnología que realmente funciona.',
    rating: 5,
  },
];

const STATS = [
  { value: '500+', label: 'Propiedades gestionadas' },
  { value: '2,000+', label: 'Transacciones exitosas' },
  { value: '30+', label: 'Asesores certificados' },
  { value: '12', label: 'Años de experiencia' },
];

export function PropietarioPage() {
  const navigate = useNavigate();

  const scrollToSteps = () => {
    document.getElementById('pp-steps')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="pp-page">

      {/* ── Hero ──────────────────────────────────────── */}
      <section className="pp-hero">
        <div className="pp-hero-bg" />
        <div className="pp-hero-inner">
          <span className="pp-hero-badge">
            <Award size={13} strokeWidth={2.5} />
            Para propietarios
          </span>
          <h1 className="pp-hero-title">
            Tu propiedad merece<br />
            <span className="pp-hero-accent">los mejores profesionales</span>
          </h1>
          <p className="pp-hero-subtitle">
            Con INTERSIM gestionas la venta o alquiler de tu inmueble respaldado por
            tecnología de punta, transparencia total y más de 30 asesores certificados
            en toda Bolivia.
          </p>
          <div className="pp-hero-actions">
            <button className="pp-btn-primary" onClick={() => navigate(ROUTES.register)}>
              Registrarme ahora
            </button>
            <button className="pp-btn-ghost" onClick={scrollToSteps}>
              Cómo funciona <ChevronDown size={17} />
            </button>
          </div>
          <div className="pp-hero-trust">
            <CheckCircle2 size={14} strokeWidth={2.5} /> Sin costos ocultos
            <CheckCircle2 size={14} strokeWidth={2.5} /> Asesores verificados
            <CheckCircle2 size={14} strokeWidth={2.5} /> Contratos con IA
          </div>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────── */}
      <div className="pp-stats-bar">
        {STATS.map((s) => (
          <div key={s.label} className="pp-stat">
            <span className="pp-stat-value">{s.value}</span>
            <span className="pp-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Benefits ──────────────────────────────────── */}
      <section className="pp-section pp-section--light">
        <div className="pp-section-inner">
          <div className="pp-section-header">
            <span className="pp-eyebrow">¿Por qué elegirnos?</span>
            <h2 className="pp-section-title">Confía tu propiedad con total tranquilidad</h2>
            <p className="pp-section-desc">
              Cada detalle del proceso está diseñado para protegerte a ti como propietario.
            </p>
          </div>
          <div className="pp-benefits-grid">
            {BENEFITS.map((b) => (
              <div key={b.title} className="pp-benefit-card">
                <div className="pp-benefit-icon">
                  <b.Icon size={22} strokeWidth={1.8} />
                </div>
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tools ─────────────────────────────────────── */}
      <section className="pp-section pp-section--white">
        <div className="pp-section-inner">
          <div className="pp-section-header">
            <span className="pp-eyebrow">Herramientas exclusivas</span>
            <h2 className="pp-section-title">Todo lo que necesitas como propietario</h2>
            <p className="pp-section-desc">
              Accede a herramientas tecnológicas que antes solo tenían las grandes inmobiliarias.
            </p>
          </div>
          <div className="pp-tools-grid">
            {TOOLS.map((t) => (
              <div
                key={t.title}
                className="pp-tool-card"
                style={{ '--tool-clr': t.color } as React.CSSProperties}
                onClick={() => navigate(t.route)}
              >
                <div className="pp-tool-icon">
                  <t.Icon size={24} strokeWidth={1.8} />
                </div>
                <h3>{t.title}</h3>
                <p>{t.desc}</p>
                <span className="pp-tool-cta">
                  {t.cta} <ArrowRight size={14} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Steps ─────────────────────────────────────── */}
      <section className="pp-section pp-section--dark" id="pp-steps">
        <div className="pp-section-inner">
          <div className="pp-section-header">
            <span className="pp-eyebrow pp-eyebrow--on-dark">El proceso</span>
            <h2 className="pp-section-title pp-title--white">Así de simple</h2>
            <p className="pp-section-desc pp-desc--light">
              En 3 pasos tu propiedad está lista para recibir compradores o inquilinos calificados.
            </p>
          </div>

          <div className="pp-steps-row">
            {STEPS.map((step, i) => (
              <div key={step.num} className="pp-step-wrap">
                <div className="pp-step">
                  <div className="pp-step-num-badge">{step.num}</div>
                  <div className="pp-step-icon-circle">
                    <step.Icon size={30} strokeWidth={1.6} />
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                  <span className="pp-step-tag">{step.detail}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="pp-step-connector">
                    <ArrowRight size={22} />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pp-steps-bottom">
            <button className="pp-btn-amber" onClick={() => navigate(ROUTES.register)}>
              Comenzar ahora — es gratis
            </button>
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────── */}
      <section className="pp-section pp-section--light">
        <div className="pp-section-inner">
          <div className="pp-section-header">
            <span className="pp-eyebrow">Testimonios</span>
            <h2 className="pp-section-title">Lo que dicen nuestros propietarios</h2>
          </div>
          <div className="pp-testimonials">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="pp-testimonial">
                <div className="pp-testimonial-stars">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <p className="pp-testimonial-text">"{t.text}"</p>
                <div className="pp-testimonial-author">
                  <div className="pp-testimonial-avatar">{t.name[0]}</div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.city}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────── */}
      <section className="pp-final-cta">
        <div className="pp-final-cta-inner">
          <div className="pp-final-cta-chips">
            {['Sin costos ocultos', 'Asesores certificados', 'IA en contratos', 'Soporte dedicado'].map((item) => (
              <span key={item}>
                <CheckCircle2 size={15} strokeWidth={2.5} />
                {item}
              </span>
            ))}
          </div>
          <h2>¿Listo para poner tu propiedad en manos de los mejores?</h2>
          <p>Únete a más de 2,000 propietarios que confiaron en INTERSIM para vender, alquilar o dar en anticrético su propiedad.</p>
          <div className="pp-final-actions">
            <button className="pp-btn-white" onClick={() => navigate(ROUTES.register)}>
              Registrarme ahora
            </button>
            <button className="pp-btn-outline-white" onClick={() => navigate(ROUTES.agente)}>
              Conocer asesores
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
