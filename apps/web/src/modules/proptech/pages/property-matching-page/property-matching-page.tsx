import { useState } from 'react';
import { usePropertyMatching } from '../../hooks/use-property-matching';
import type { ClientPreference } from '../../types/property-matching.types';
import { OPERATION_TYPE_LABELS, PROPERTY_TYPE_LABELS } from '../../constants/property-types.constant';
import './property-matching-page.css';

export function PropertyMatchingPage() {
  const { result, loading, error, runMatching } = usePropertyMatching();
  const [clientId, setClientId] = useState('');
  const [preference, setPreference] = useState<ClientPreference>({
    urgencyLevel: 'medium',
    purchaseIntention: 'within_3_months',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) return;
    await runMatching(clientId, preference);
  };

  return (
    <section className="property-matching-page">
      <div className="property-matching-page__header">
        <p className="property-matching-page__eyebrow">Proptech — Matching IA</p>
        <h2 className="property-matching-page__title">Matching inteligente de propiedades</h2>
        <p className="property-matching-page__description">
          El sistema analiza el perfil del cliente y encuentra las propiedades más compatibles usando IA.
        </p>
      </div>

      <form className="property-matching-page__form" onSubmit={handleSubmit}>
        <div className="property-matching-page__field">
          <label>ID del cliente</label>
          <input
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            placeholder="UUID del cliente"
            required
          />
        </div>

        <div className="property-matching-page__row">
          <div className="property-matching-page__field">
            <label>Tipo de operación</label>
            <select onChange={(e) => setPreference((p) => ({ ...p, operationType: e.target.value }))}>
              <option value="">Cualquiera</option>
              {Object.entries(OPERATION_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div className="property-matching-page__field">
            <label>Tipo de inmueble</label>
            <select onChange={(e) => setPreference((p) => ({ ...p, propertyType: e.target.value }))}>
              <option value="">Cualquiera</option>
              {Object.entries(PROPERTY_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
        </div>

        <div className="property-matching-page__row">
          <div className="property-matching-page__field">
            <label>Precio mínimo (USD)</label>
            <input
              type="number"
              onChange={(e) => setPreference((p) => ({ ...p, minPrice: Number(e.target.value) || undefined }))}
            />
          </div>
          <div className="property-matching-page__field">
            <label>Precio máximo (USD)</label>
            <input
              type="number"
              onChange={(e) => setPreference((p) => ({ ...p, maxPrice: Number(e.target.value) || undefined }))}
            />
          </div>
        </div>

        <div className="property-matching-page__row">
          <div className="property-matching-page__field">
            <label>Ciudad preferida</label>
            <input onChange={(e) => setPreference((p) => ({ ...p, preferredCity: e.target.value || undefined }))} />
          </div>
          <div className="property-matching-page__field">
            <label>Urgencia</label>
            <select onChange={(e) => setPreference((p) => ({ ...p, urgencyLevel: e.target.value as never }))}>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </select>
          </div>
        </div>

        <button type="submit" disabled={loading} className="property-matching-page__submit">
          {loading ? 'Ejecutando matching...' : 'Ejecutar matching IA'}
        </button>
      </form>

      {error && <p className="property-matching-page__error">{error}</p>}

      {result && (
        <div className="property-matching-page__results">
          <h3>Resultados: {result.totalMatches} propiedades compatibles</h3>
          <div className="property-matching-page__list">
            {result.matches.map((match) => (
              <article key={match.id} className="match-card">
                <div className="match-card__score">
                  <span className="match-card__score-value">{match.score}</span>
                  <span className="match-card__score-label">/ 100</span>
                </div>
                <div className="match-card__info">
                  <p className="match-card__property-id">Propiedad: {match.propertyId}</p>
                  {match.matchReason && <p className="match-card__reason">{match.matchReason}</p>}
                  {match.riskFlags && match.riskFlags.length > 0 && (
                    <p className="match-card__risk">⚠ {match.riskFlags.join(', ')}</p>
                  )}
                  <div className="match-card__breakdown">
                    {Object.entries(match.scoreBreakdown).map(([k, v]) => (
                      <span key={k} className="match-card__breakdown-item">{k}: {v}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
