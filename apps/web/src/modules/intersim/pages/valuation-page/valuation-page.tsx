import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  Calculator,
  CheckCircle2,
  FileCheck2,
  MapPin,
  Ruler,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { ROUTES } from '@core/constants/routes.constants';
import { LocationSelector } from '@modules/proptech/shared/components/location-selector/location-selector';
import type { LocationValue } from '@modules/proptech/shared/components/location-selector/location-selector.types';
import './valuation-page.css';

type PropertyType = 'apartment' | 'house' | 'land' | 'commercial';
type OperationType = 'sale' | 'rent' | 'anticretic';
type ConditionType = 'new' | 'good' | 'renovate';
type LegalStatus = 'complete' | 'review' | 'pending';

interface ValuationForm {
  location: LocationValue;
  zone: string;
  propertyType: PropertyType;
  operation: OperationType;
  surface: number;
  bedrooms: number;
  bathrooms: number;
  condition: ConditionType;
  legalStatus: LegalStatus;
  hasGarage: boolean;
  hasServices: boolean;
}

interface ValuationResult {
  low: number;
  high: number;
  marketValue: number;
  pricePerM2: number;
  rentReference: number;
  anticreticReference: number;
  confidence: string;
}

const PROPERTY_BASE: Record<PropertyType, number> = {
  apartment: 820,
  house: 690,
  land: 165,
  commercial: 980,
};

const PROPERTY_LABELS: Record<PropertyType, string> = {
  apartment: 'Departamento',
  house: 'Casa',
  land: 'Terreno',
  commercial: 'Local comercial',
};

const OPERATION_LABELS: Record<OperationType, string> = {
  sale: 'Venta',
  rent: 'Alquiler',
  anticretic: 'Anticrético',
};

const CONDITION_FACTORS: Record<ConditionType, number> = {
  new: 1.12,
  good: 1,
  renovate: 0.86,
};

const LEGAL_FACTORS: Record<LegalStatus, number> = {
  complete: 1.06,
  review: 0.96,
  pending: 0.84,
};

const FACTORS = [
  {
    icon: MapPin,
    title: 'Ubicación y zona',
    text: 'Compara ciudad, zona, accesos, cercanía a servicios y demanda real del sector.',
    tone: 'blue',
  },
  {
    icon: Ruler,
    title: 'Superficie útil',
    text: 'Calcula por metro cuadrado y ajusta según tipo de inmueble, distribución y uso.',
    tone: 'emerald',
  },
  {
    icon: FileCheck2,
    title: 'Papeles y respaldo',
    text: 'Premia propiedades con folio, impuestos, planos y documentación lista para cerrar.',
    tone: 'amber',
  },
  {
    icon: TrendingUp,
    title: 'Pulso del mercado',
    text: 'Entrega una referencia para venta, alquiler o anticrético con rango prudente.',
    tone: 'rose',
  },
];

const PROCESS = [
  'Captura los datos clave del inmueble',
  'Ajusta el valor por ciudad, zona y estado',
  'Genera un rango comercial defendible',
  'Conecta con un asesor para revisión documental',
];

function formatUsd(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function getCityFactor(cityName?: string) {
  const city = (cityName ?? '').toLowerCase();
  if (city.includes('santa cruz')) return 1.15;
  if (city.includes('la paz')) return 1.08;
  if (city.includes('cochabamba')) return 1;
  if (city.includes('tarija')) return 0.94;
  return 0.9;
}

function getZoneFactor(zone: string) {
  const normalized = zone.toLowerCase();
  if (/(equipetrol|urubo|calacoto|san miguel|cala cala|queru queru|las palmas)/.test(normalized)) return 1.18;
  if (/(centro|norte|bello horizonte|sarco|achumani|sopocachi)/.test(normalized)) return 1.08;
  if (normalized.trim().length > 2) return 1;
  return 0.96;
}

function calculateValuation(form: ValuationForm): ValuationResult {
  const safeSurface = Math.max(form.surface || 0, 20);
  const baseM2 = PROPERTY_BASE[form.propertyType];
  const cityFactor = getCityFactor(form.location.cityName);
  const zoneFactor = getZoneFactor(form.zone);
  const conditionFactor = CONDITION_FACTORS[form.condition];
  const legalFactor = LEGAL_FACTORS[form.legalStatus];
  const servicesFactor = form.hasServices ? 1.04 : 0.94;
  const garageFactor = form.hasGarage && form.propertyType !== 'land' ? 1.035 : 1;
  const roomsFactor = form.propertyType === 'land'
    ? 1
    : 1 + Math.min(form.bedrooms, 5) * 0.012 + Math.min(form.bathrooms, 4) * 0.01;

  const adjustedM2 = baseM2 * cityFactor * zoneFactor * conditionFactor * legalFactor * servicesFactor * garageFactor * roomsFactor;
  const marketValue = Math.round(adjustedM2 * safeSurface);
  const spread = form.legalStatus === 'complete' ? 0.1 : 0.15;

  return {
    low: Math.round(marketValue * (1 - spread)),
    high: Math.round(marketValue * (1 + spread)),
    marketValue,
    pricePerM2: Math.round(adjustedM2),
    rentReference: Math.round(marketValue * 0.0048),
    anticreticReference: Math.round(marketValue * 0.34),
    confidence: form.legalStatus === 'complete' && form.zone.trim() ? 'Alta' : 'Media',
  };
}

export function ValuationPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<ValuationForm>({
    location: {
      countryCode: 'BO',
      countryName: 'Bolivia',
      cityName: 'Cochabamba',
    },
    zone: 'Cala Cala',
    propertyType: 'apartment',
    operation: 'sale',
    surface: 120,
    bedrooms: 3,
    bathrooms: 2,
    condition: 'good',
    legalStatus: 'complete',
    hasGarage: true,
    hasServices: true,
  });
  const [calculatedForm, setCalculatedForm] = useState<ValuationForm>(form);
  const result = useMemo(() => calculateValuation(calculatedForm), [calculatedForm]);

  const selectedSummary = useMemo(() => {
    const city = calculatedForm.location.cityName || 'tu ciudad';
    const zone = calculatedForm.zone.trim() || 'zona por confirmar';
    return `${PROPERTY_LABELS[calculatedForm.propertyType]} en ${zone}, ${city}`;
  }, [calculatedForm.location.cityName, calculatedForm.propertyType, calculatedForm.zone]);

  const updateField = <K extends keyof ValuationForm>(field: K, value: ValuationForm[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleCalculate = () => {
    setCalculatedForm(form);
  };

  return (
    <main className="valuation-page">
      <section className="valuation-hero">
        <div className="valuation-hero__media" />
        <div className="valuation-hero__overlay" />
        <div className="valuation-hero__content">
          <div className="valuation-hero__eyebrow">
            <BarChart3 size={18} />
            Valoración inmobiliaria inteligente
          </div>
          <h1>Valoriza tu propiedad con datos de mercado</h1>
          <p>
            Estima un rango comercial para venta, alquiler o anticrético considerando ubicación,
            superficie, estado del inmueble y respaldo documental.
          </p>
          <div className="valuation-hero__actions">
            <a href="#valuation-tool" className="valuation-btn valuation-btn--primary">
              Calcular ahora
              <Calculator size={18} />
            </a>
            <button className="valuation-btn valuation-btn--glass" onClick={() => navigate(ROUTES.register)}>
              Guardar mi valoración
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
        <div className="valuation-hero__metrics" aria-label="Indicadores de valoración">
          <div>
            <strong>3</strong>
            <span>ciudades base</span>
          </div>
          <div>
            <strong>8+</strong>
            <span>variables clave</span>
          </div>
          <div>
            <strong>24h</strong>
            <span>revision pro</span>
          </div>
        </div>
      </section>

      <section className="valuation-tool" id="valuation-tool">
        <div className="valuation-tool__header">
          <span>Estimador especializado</span>
          <h2>Ingresa los datos del inmueble</h2>
          <p>El cálculo entrega una referencia inicial. Un asesor puede validarla con documentos y comparables reales.</p>
        </div>

        <div className="valuation-tool__grid">
          <form className="valuation-form" onSubmit={(event) => { event.preventDefault(); handleCalculate(); }}>
            <LocationSelector
              autoDetect
              label="Ubicación del inmueble"
              value={form.location}
              onChange={(location) => updateField('location', location)}
            />

            <label className="valuation-field valuation-field--wide">
              <span>Zona / barrio</span>
              <input
                value={form.zone}
                onChange={(event) => updateField('zone', event.target.value)}
                placeholder="Ej. Cala Cala, Equipetrol, Calacoto"
              />
            </label>

            <div className="valuation-form__row">
              <label className="valuation-field">
                <span>Tipo de inmueble</span>
                <select value={form.propertyType} onChange={(event) => updateField('propertyType', event.target.value as PropertyType)}>
                  <option value="apartment">Departamento</option>
                  <option value="house">Casa</option>
                  <option value="land">Terreno</option>
                  <option value="commercial">Local comercial</option>
                </select>
              </label>

              <label className="valuation-field">
                <span>Operacion objetivo</span>
                <select value={form.operation} onChange={(event) => updateField('operation', event.target.value as OperationType)}>
                  <option value="sale">Venta</option>
                  <option value="rent">Alquiler</option>
                  <option value="anticretic">Anticrético</option>
                </select>
              </label>
            </div>

            <div className="valuation-form__row valuation-form__row--thirds">
              <label className="valuation-field">
                <span>Superficie m2</span>
                <input
                  type="number"
                  min={20}
                  value={form.surface}
                  onChange={(event) => updateField('surface', Number(event.target.value))}
                />
              </label>

              <label className="valuation-field">
                <span>Dormitorios</span>
                <input
                  type="number"
                  min={0}
                  value={form.bedrooms}
                  onChange={(event) => updateField('bedrooms', Number(event.target.value))}
                  disabled={form.propertyType === 'land'}
                />
              </label>

              <label className="valuation-field">
                <span>Baños</span>
                <input
                  type="number"
                  min={0}
                  value={form.bathrooms}
                  onChange={(event) => updateField('bathrooms', Number(event.target.value))}
                  disabled={form.propertyType === 'land'}
                />
              </label>
            </div>

            <div className="valuation-form__row">
              <label className="valuation-field">
                <span>Estado físico</span>
                <select value={form.condition} onChange={(event) => updateField('condition', event.target.value as ConditionType)}>
                  <option value="new">Nuevo / remodelado</option>
                  <option value="good">Bueno y habitable</option>
                  <option value="renovate">Requiere mejoras</option>
                </select>
              </label>

              <label className="valuation-field">
                <span>Documentación</span>
                <select value={form.legalStatus} onChange={(event) => updateField('legalStatus', event.target.value as LegalStatus)}>
                  <option value="complete">Papeles listos</option>
                  <option value="review">En revision</option>
                  <option value="pending">Faltan documentos</option>
                </select>
              </label>
            </div>

            <div className="valuation-checks">
              <label>
                <input
                  type="checkbox"
                  checked={form.hasGarage}
                  onChange={(event) => updateField('hasGarage', event.target.checked)}
                  disabled={form.propertyType === 'land'}
                />
                Parqueo propio
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={form.hasServices}
                  onChange={(event) => updateField('hasServices', event.target.checked)}
                />
                Servicios básicos disponibles
              </label>
            </div>

            <button className="valuation-submit" type="submit">
              Calcular rango estimado
              <Calculator size={18} />
            </button>
          </form>

          <aside className="valuation-result" aria-live="polite">
            <div className="valuation-result__top">
              <span>{OPERATION_LABELS[calculatedForm.operation]}</span>
              <h3>{selectedSummary}</h3>
            </div>

            <div className="valuation-result__range">
              <small>Rango recomendado</small>
              <strong>{formatUsd(result.low)} - {formatUsd(result.high)}</strong>
            </div>

            <div className="valuation-result__stats">
              <div>
                <span>Valor medio</span>
                <strong>{formatUsd(result.marketValue)}</strong>
              </div>
              <div>
                <span>Precio m2</span>
                <strong>{formatUsd(result.pricePerM2)}</strong>
              </div>
              <div>
                <span>Alquiler ref.</span>
                <strong>{formatUsd(result.rentReference)}</strong>
              </div>
              <div>
                <span>Anticrético ref.</span>
                <strong>{formatUsd(result.anticreticReference)}</strong>
              </div>
            </div>

            <div className="valuation-result__confidence">
              <ShieldCheck size={18} />
              <span>Confianza {result.confidence}. Mejora con fotos, folio real, impuestos y comparables recientes.</span>
            </div>

            <button className="valuation-result__cta" onClick={() => navigate(ROUTES.register)}>
              Guardar informe en mi cuenta
              <ArrowRight size={18} />
            </button>
          </aside>
        </div>
      </section>

      <section className="valuation-factors">
        <div className="valuation-section-head">
          <span>Qué toma en cuenta</span>
          <h2>Una valoración útil para negociar, publicar o decidir</h2>
        </div>
        <div className="valuation-factors__grid">
          {FACTORS.map((factor) => {
            const Icon = factor.icon;
            return (
              <article key={factor.title} className={`valuation-factor valuation-factor--${factor.tone}`}>
                <div className="valuation-factor__icon">
                  <Icon size={24} />
                </div>
                <h3>{factor.title}</h3>
                <p>{factor.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="valuation-process">
        <div className="valuation-process__copy">
          <span>Revisión profesional</span>
          <h2>Del cálculo inicial a un informe defendible</h2>
          <p>
            La plataforma puede guardar tu valoración, adjuntar papeles del inmueble y preparar una revisión
            con un agente para publicar con mejor precio y menor riesgo.
          </p>
          <button className="valuation-btn valuation-btn--dark" onClick={() => navigate(ROUTES.register)}>
            Crear cuenta de propietario
            <ArrowRight size={18} />
          </button>
        </div>
        <div className="valuation-process__steps">
          {PROCESS.map((step, index) => (
            <div key={step} className="valuation-step">
              <strong>{String(index + 1).padStart(2, '0')}</strong>
              <span>{step}</span>
              <CheckCircle2 size={20} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
