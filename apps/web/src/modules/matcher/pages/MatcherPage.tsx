import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './MatcherPage.css';

const API = 'http://localhost:8000';

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
  price_usd: number;
  rooms: number;
  area_m2: number;
  has_parking: boolean;
  pet_friendly: boolean;
  score: number;
  reason: string;
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
      .catch(() => setError('No se pudo conectar con el servidor de agentes (localhost:8000).'))
      .finally(() => setLoading(false));
  }, [leadId]);

  if (loading) return <div className="matcher-state">Cargando propiedades...</div>;
  if (error) return <div className="matcher-state matcher-state--error">{error}</div>;
  if (!lead) return null;

  const opLabel: Record<string, string> = {
    alquiler: 'Alquiler',
    anticretico: 'Anticrético',
    venta: 'Venta',
  };

  return (
    <section className="matcher">
      <div className="matcher__header">
        <div>
          <p className="matcher__eyebrow">CasaLens · Property Matcher</p>
          <h2 className="matcher__title">Propiedades para tu perfil</h2>
          <p className="matcher__lead-id">Lead {lead.id}</p>
        </div>
      </div>

      <div className="matcher__profile">
        {lead.operation_type && (
          <span className="matcher__tag">{opLabel[lead.operation_type] ?? lead.operation_type}</span>
        )}
        {lead.budget_usd && (
          <span className="matcher__tag">USD {lead.budget_usd.toLocaleString()}</span>
        )}
        {lead.rooms && <span className="matcher__tag">{lead.rooms} dorm.</span>}
        {lead.zones?.map((z) => (
          <span key={z} className="matcher__tag matcher__tag--zone">{z}</span>
        ))}
        {lead.timing_weeks && (
          <span className="matcher__tag matcher__tag--timing">
            Urgencia: {lead.timing_weeks} sem.
          </span>
        )}
      </div>

      {matches.length === 0 ? (
        <div className="matcher-state matcher-state--empty">
          <p>{message || 'No se encontraron propiedades por el momento.'}</p>
          <p className="matcher-state__hint">
            Generá las propiedades sintéticas con <code>python -m app.data.synthetic_properties</code>
          </p>
        </div>
      ) : (
        <div className="matcher__grid">
          {matches.map((m) => (
            <article key={m.property_id} className="property-card">
              <div className="property-card__score">{Math.round(m.score * 100)}% match</div>
              <h3 className="property-card__title">{m.title}</h3>
              <p className="property-card__zone">{m.zone}</p>
              <p className="property-card__price">USD {m.price_usd.toLocaleString()}</p>
              <div className="property-card__meta">
                <span>{m.rooms} dorm.</span>
                <span>{m.area_m2} m²</span>
                {m.has_parking && <span>🅿 Parking</span>}
                {m.pet_friendly && <span>🐾 Pet friendly</span>}
              </div>
              <p className="property-card__reason">{m.reason}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
