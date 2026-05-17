import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, BadgeCheck, Building2, CheckCircle2, ChevronRight,
  CreditCard, Lock, QrCode, ShieldCheck, Star,
} from 'lucide-react';
import { ROUTES } from '@core/constants/routes.constants';
import './agent-payment-page.css';

/* ── Plan catalog ────────────────────────────────────────────── */

const PLAN_DATA: Record<string, {
  name: string; price: number; color: string; tag?: string;
  properties: number; highlights: string[];
}> = {
  basico: {
    name: 'Básico',
    price: 40,
    color: '#64748b',
    properties: 5,
    highlights: [
      '5 propiedades activas',
      'Agente IA para contratos (básico)',
      'Reportes mensuales',
      'Perfil de agente verificado',
    ],
  },
  platino: {
    name: 'Platino',
    price: 60,
    color: '#7c3aed',
    tag: 'Más popular',
    properties: 10,
    highlights: [
      '10 propiedades activas',
      'Agente IA avanzado para contratos',
      'Reportes semanales',
      'Recomendaciones IA a clientes',
      'Perfil destacado en búsquedas',
    ],
  },
  diamante: {
    name: 'Diamante',
    price: 100,
    color: '#0ea5e9',
    properties: 15,
    highlights: [
      '15 propiedades activas',
      'Agente IA completo',
      'Reportes semanales + analítica avanzada',
      'Recomendaciones IA premium',
      'CRM avanzado integrado',
      'Campañas de marketing digital',
      'Badge de Agente Premium',
    ],
  },
};

type PayMethod = 'card' | 'qr';

function formatCard(value: string) {
  return value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})/g, '$1 ').trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

/* ── Component ────────────────────────────────────────────────── */

export function AgentPaymentPage() {
  const { plan } = useParams<{ plan: string }>();
  const navigate = useNavigate();
  const planData = PLAN_DATA[plan ?? ''];
  const [method, setMethod] = useState<PayMethod>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!planData) {
    return (
      <div className="apm-not-found">
        <h2>Plan no encontrado</h2>
        <Link to={ROUTES.agente}>← Volver a planes</Link>
      </div>
    );
  }

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (method === 'card' && (!cardNumber || !cardName || !expiry || !cvv)) return;
    setPaying(true);
    await new Promise((r) => setTimeout(r, 1800));
    setPaying(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="apm-success">
        <div className="apm-success__card">
          <div className="apm-success__icon">
            <BadgeCheck size={56} />
          </div>
          <h2>¡Suscripción activada!</h2>
          <p>
            Tu plan <strong>{planData.name}</strong> está activo. Recibirás
            un email de confirmación en breve.
          </p>
          <div className="apm-success__details">
            <span>Plan: {planData.name}</span>
            <span>${planData.price} / mes</span>
          </div>
          <button className="apm-pay-btn" onClick={() => navigate(ROUTES.app)}>
            Ir a mi portal <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="apm-page">
      {/* Breadcrumb */}
      <div className="apm-crumb">
        <Link to={ROUTES.agente} className="apm-crumb__back">
          <ArrowLeft size={16} /> Agente Inmobiliario
        </Link>
        <ChevronRight size={14} className="apm-crumb__sep" />
        <span>Pago · Plan {planData.name}</span>
      </div>

      <div className="apm-layout">
        {/* Left — Plan summary */}
        <aside className="apm-summary">
          <div className="apm-summary__head" style={{ background: `linear-gradient(135deg, ${planData.color}22, ${planData.color}44)`, borderColor: `${planData.color}55` }}>
            {planData.tag && (
              <div className="apm-summary__tag">
                <Star size={11} /> {planData.tag}
              </div>
            )}
            <h2 className="apm-summary__plan" style={{ color: planData.color }}>
              Plan {planData.name}
            </h2>
            <div className="apm-summary__price">
              <strong style={{ color: planData.color }}>${planData.price}</strong>
              <span>/mes</span>
            </div>
            <div className="apm-summary__props">
              <Building2 size={14} />
              Hasta {planData.properties} propiedades activas
            </div>
          </div>

          <ul className="apm-summary__features">
            {planData.highlights.map((h) => (
              <li key={h}>
                <CheckCircle2 size={15} />
                {h}
              </li>
            ))}
          </ul>

          <div className="apm-summary__secure">
            <ShieldCheck size={16} />
            <span>Pago 100% seguro con cifrado SSL</span>
          </div>

          <div className="apm-summary__note">
            Se renueva automáticamente cada mes. Cancela cuando quieras desde tu perfil.
          </div>
        </aside>

        {/* Right — Payment form */}
        <section className="apm-checkout">
          <h2 className="apm-checkout__title">
            <Lock size={18} /> Datos de pago
          </h2>

          {/* Method tabs */}
          <div className="apm-methods">
            <button
              type="button"
              className={`apm-method ${method === 'card' ? 'apm-method--active' : ''}`}
              onClick={() => setMethod('card')}
            >
              <CreditCard size={18} />
              Tarjeta
            </button>
            <button
              type="button"
              className={`apm-method ${method === 'qr' ? 'apm-method--active' : ''}`}
              onClick={() => setMethod('qr')}
            >
              <QrCode size={18} />
              QR / Transferencia
            </button>
          </div>

          {/* Card form */}
          {method === 'card' && (
            <form className="apm-form" onSubmit={handlePay}>
              {/* Card visual */}
              <div className="apm-card-preview" style={{ background: `linear-gradient(135deg, ${planData.color}, #0f172a)` }}>
                <div className="apm-card-preview__chip" />
                <div className="apm-card-preview__number">
                  {cardNumber || '•••• •••• •••• ••••'}
                </div>
                <div className="apm-card-preview__footer">
                  <div>
                    <span>Titular</span>
                    <strong>{cardName || 'NOMBRE APELLIDO'}</strong>
                  </div>
                  <div>
                    <span>Vence</span>
                    <strong>{expiry || 'MM/AA'}</strong>
                  </div>
                </div>
              </div>

              <label className="apm-field apm-field--wide">
                <span>Número de tarjeta</span>
                <div className="apm-field__wrap">
                  <CreditCard size={17} className="apm-field__icon" />
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCard(e.target.value))}
                    maxLength={19}
                    required
                  />
                </div>
              </label>

              <label className="apm-field apm-field--wide">
                <span>Nombre del titular</span>
                <input
                  type="text"
                  placeholder="Como aparece en la tarjeta"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                  required
                />
              </label>

              <div className="apm-row">
                <label className="apm-field">
                  <span>Fecha de vencimiento</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="MM/AA"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    maxLength={5}
                    required
                  />
                </label>
                <label className="apm-field">
                  <span>CVV</span>
                  <input
                    type="password"
                    inputMode="numeric"
                    placeholder="•••"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    maxLength={4}
                    required
                  />
                </label>
              </div>

              <button className="apm-pay-btn" type="submit" disabled={paying}>
                {paying ? (
                  <>
                    <span className="apm-spinner" />
                    Procesando…
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    Pagar ${planData.price} y activar plan
                  </>
                )}
              </button>
              <p className="apm-terms">
                Al pagar aceptas los <a href="#">Términos de servicio</a> y la <a href="#">Política de privacidad</a>.
              </p>
            </form>
          )}

          {/* QR / Transfer form */}
          {method === 'qr' && (
            <div className="apm-qr">
              <div className="apm-qr__amount">
                Monto a pagar: <strong>${planData.price} USD</strong>
              </div>

              <div className="apm-qr__visual">
                <QrCode size={130} strokeWidth={1.2} />
                <p>Escanea con tu app bancaria</p>
              </div>

              <div className="apm-qr__banks">
                <div className="apm-qr__bank">
                  <strong>BNB</strong>
                  <span>Cuenta: 1234-5678-90</span>
                </div>
                <div className="apm-qr__bank">
                  <strong>Tigo Money</strong>
                  <span>71234567</span>
                </div>
                <div className="apm-qr__bank">
                  <strong>BCP</strong>
                  <span>Cuenta: 9876-5432-10</span>
                </div>
                <div className="apm-qr__bank">
                  <strong>Banco Unión</strong>
                  <span>Cuenta: 5544-3322-11</span>
                </div>
              </div>

              <div className="apm-qr__steps">
                <p>Una vez realizada la transferencia:</p>
                <ol>
                  <li>Guarda el comprobante de pago</li>
                  <li>Envíalo a <strong>pagos@intersim.bo</strong></li>
                  <li>Tu plan se activa en menos de 2 horas hábiles</li>
                </ol>
              </div>

              <button
                className="apm-pay-btn"
                type="button"
                onClick={() => setSuccess(true)}
              >
                Ya realicé la transferencia <ChevronRight size={16} />
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
