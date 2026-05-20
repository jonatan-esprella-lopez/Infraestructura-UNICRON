import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { environment } from '@bootstrap/environment';
import './MatcherPage.css';

const API = environment.agentsApiUrl;

interface Lead {
  id: string;
  operation_type: string | null;
  budget_usd: number | null;
  zones: string[] | null;
  rooms: number | null;
  timing_weeks: number | null;
  profile: Record<string, unknown>;
}

interface Match {
  property_id: string;
  title: string;
  zone: string;
  operation_type: string;
  price_usd: number;
  rooms: number;
  bathrooms: number;
  area_m2: number;
  has_parking: boolean;
  pet_friendly: boolean;
  photo_urls: string[];
  score: number;
  reason: string;
}

const OP_LABEL: Record<string, string> = {
  alquiler: 'ALQUILER',
  anticretico: 'ANTICRÉTICO',
  venta: 'VENTA',
};

const OP_GRADIENT: Record<string, string> = {
  alquiler: 'linear-gradient(135deg, #1a56db 0%, #4f8ef7 100%)',
  anticretico: 'linear-gradient(135deg, #6d28d9 0%, #a78bfa 100%)',
  venta: 'linear-gradient(135deg, #065f46 0%, #34d399 100%)',
};

function PropertyCard({ m }: { m: Match }) {
  const photo = m.photo_urls?.[0];
  const gradient = OP_GRADIENT[m.operation_type] ?? 'linear-gradient(135deg, #374151 0%, #6b7280 100%)';

  return (
    <article className="pc">
      {/* Image area */}
      <div
        className="pc__image"
        style={photo ? { backgroundImage: `url(${photo})` } : { background: gradient }}
      >
        <span className="pc__op-badge">{OP_LABEL[m.operation_type] ?? m.operation_type.toUpperCase()}</span>
        <span className="pc__price-badge">USD {m.price_usd.toLocaleString()}</span>
        <span className="pc__score-badge">{Math.round(m.score * 100)}% match</span>
      </div>

      {/* Body */}
      <div className="pc__body">
        <h3 className="pc__title">{m.title}</h3>
        <p className="pc__zone">
          <svg className="pc__pin" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {m.zone}
        </p>

        <div className="pc__metrics">
          {m.rooms > 0 && (
            <span className="pc__metric">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 22V12a9 9 0 0 1 18 0v10" /><path d="M3 18h18" /><path d="M9 22v-4h6v4" />
              </svg>
              {m.rooms}
            </span>
          )}
          {m.bathrooms > 0 && (
            <span className="pc__metric">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
                <line x1="10" y1="5" x2="8" y2="7" /><line x1="2" y1="12" x2="22" y2="12" />
              </svg>
              {m.bathrooms}
            </span>
          )}
          {m.area_m2 > 0 && (
            <span className="pc__metric">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
              </svg>
              {m.area_m2} m²
            </span>
          )}
          {m.has_parking && <span className="pc__badge-pill">Parking</span>}
          {m.pet_friendly && <span className="pc__badge-pill">Pet friendly</span>}
        </div>

        <p className="pc__reason">{m.reason}</p>

        <button className="pc__cta">Ver detalles →</button>
      </div>
    </article>
  );
}

export function MatcherPage() {
  const [params] = useSearchParams();
  const leadId = params.get('lead');

  const [lead, setLead] = useState<Lead | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!leadId) {
      setError('No se proporcionó un lead ID en la URL.');
      setLoading(false);
      return;
    }

    Promise.all([
      fetch(`${API}/leads/${leadId}`).then((r) => (r.ok ? r.json() : Promise.reject(r.status))),
      fetch(`${API}/leads/${leadId}/matches`).then((r) => (r.ok ? r.json() : Promise.reject(r.status))),
    ])
      .then(([leadData, matchData]) => {
        setLead(leadData);
        setMatches(matchData.matches ?? []);
        setMessage(matchData.message ?? '');
      })
      .catch(() => setError('No se pudo conectar con el servidor de agentes.'))
      .finally(() => setLoading(false));
  }, [leadId]);

  if (loading) {
    return (
      <div className="matcher-state">
        <div className="matcher-state__spinner" />
        <p>Buscando propiedades para tu perfil...</p>
      </div>
    );
  }

  if (error) return <div className="matcher-state matcher-state--error">{error}</div>;
  if (!lead) return null;

  const opLabel: Record<string, string> = { alquiler: 'Alquiler', anticretico: 'Anticrético', venta: 'Venta' };

  return (
    <section className="matcher">
      <div className="matcher__header">
        <div>
          <p className="matcher__eyebrow">CasaLens · Property Matcher</p>
          <h2 className="matcher__title">Propiedades para tu perfil</h2>
        </div>
      </div>

      <div className="matcher__profile">
        {lead.operation_type && (
          <span className="matcher__tag">{opLabel[lead.operation_type] ?? lead.operation_type}</span>
        )}
        {lead.budget_usd && (
          <span className="matcher__tag">USD {Number(lead.budget_usd).toLocaleString()}</span>
        )}
        {lead.rooms && <span className="matcher__tag">{lead.rooms} dorm.</span>}
        {lead.zones?.map((z) => (
          <span key={z} className="matcher__tag matcher__tag--zone">{z}</span>
        ))}
      </div>

      {matches.length === 0 ? (
        <div className="matcher-state matcher-state--empty">
          <p>{message || 'No se encontraron propiedades por el momento.'}</p>
        </div>
      ) : (
        <div className="matcher__grid">
          {matches.map((m) => <PropertyCard key={m.property_id} m={m} />)}
        </div>
      )}
    </section>
  );
}
