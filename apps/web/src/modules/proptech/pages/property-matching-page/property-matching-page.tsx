import { useEffect, useState } from 'react';
import { usePropertyMatching } from '../../hooks/use-property-matching';
import type { ClientPreference, PropertyMatch } from '../../types/property-matching.types';
import { propertyMatchingService } from '../../services/property-matching.service';
import { OPERATION_TYPE_LABELS, PROPERTY_TYPE_LABELS } from '../../constants/property-types.constant';
import './property-matching-page.css';

const RESULT_LABELS: Record<string, string> = {
  interested: 'Interesado',
  not_interested: 'No interesado',
  pending_decision: 'Pendiente',
  offer_made: 'Oferta realizada',
};

function scoreColor(score: number): string {
  if (score >= 70) return '#22c55e';
  if (score >= 45) return '#f59e0b';
  return '#ef4444';
}

interface ClientGroup {
  clientId: string;
  matches: PropertyMatch[];
  topScore: number;
  lastRun: string;
}

function groupByClient(matches: PropertyMatch[]): ClientGroup[] {
  const map = new Map<string, PropertyMatch[]>();
  for (const m of matches) {
    const arr = map.get(m.clientId) ?? [];
    arr.push(m);
    map.set(m.clientId, arr);
  }
  return Array.from(map.entries())
    .map(([clientId, items]) => ({
      clientId,
      matches: items,
      topScore: Math.max(...items.map((i) => i.score)),
      lastRun: items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]?.createdAt ?? '',
    }))
    .sort((a, b) => new Date(b.lastRun).getTime() - new Date(a.lastRun).getTime());
}

export function PropertyMatchingPage() {
  const { result, loading, error, runMatching } = usePropertyMatching();
  const [clientId, setClientId] = useState('');
  const [preference, setPreference] = useState<ClientPreference>({
    urgencyLevel: 'medium',
    purchaseIntention: 'within_3_months',
  });

  const [history, setHistory] = useState<ClientGroup[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [detailMatches, setDetailMatches] = useState<PropertyMatch[]>([]);

  useEffect(() => {
    setHistoryLoading(true);
    propertyMatchingService.getAll()
      .then((all) => setHistory(groupByClient(all)))
      .catch(() => { /* ignore */ })
      .finally(() => setHistoryLoading(false));
  }, [result]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) return;
    const data = await runMatching(clientId, preference);
    if (data) {
      setSelectedClientId(clientId);
      setDetailMatches(data.matches);
    }
  };

  const handleSelectClient = (group: ClientGroup) => {
    setSelectedClientId(group.clientId);
    setDetailMatches(group.matches);
  };

  return (
    <div className="pmp">
      {/* Header */}
      <div className="pmp-header">
        <p className="pmp-header__crumb">Proptech / Matching IA</p>
        <h2 className="pmp-header__title">Matching inteligente de propiedades</h2>
        <p className="pmp-header__sub">
          El sistema analiza el perfil del cliente y encuentra las propiedades más compatibles usando IA.
        </p>
      </div>

      <div className="pmp-body">
        {/* Left panel: history + form */}
        <div className="pmp-left">
          {/* History */}
          <div className="pmp-section">
            <h3 className="pmp-section__title">Historial de matchings</h3>
            {historyLoading && <div className="pmp-state"><div className="pmp-spinner" /> Cargando...</div>}
            {!historyLoading && history.length === 0 && (
              <div className="pmp-empty">
                <span className="pmp-empty__icon">🔍</span>
                <p className="pmp-empty__text">Sin matchings ejecutados aún</p>
              </div>
            )}
            {!historyLoading && history.length > 0 && (
              <div className="pmp-history">
                {history.map((group) => (
                  <button
                    key={group.clientId}
                    className={`pmp-history-item${selectedClientId === group.clientId ? ' pmp-history-item--active' : ''}`}
                    onClick={() => handleSelectClient(group)}
                  >
                    <div className="pmp-history-item__score" style={{ background: scoreColor(group.topScore) + '18', color: scoreColor(group.topScore) }}>
                      {group.topScore}
                    </div>
                    <div className="pmp-history-item__info">
                      <span className="pmp-history-item__client">
                        Cliente: <code>{group.clientId.slice(0, 12)}…</code>
                      </span>
                      <span className="pmp-history-item__meta">
                        {group.matches.length} propiedades · {new Date(group.lastRun).toLocaleDateString('es-BO')}
                      </span>
                    </div>
                    <span className="pmp-history-item__arrow">›</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* New matching form */}
          <div className="pmp-section">
            <h3 className="pmp-section__title">Ejecutar nuevo matching</h3>
            <form className="pmp-form" onSubmit={handleSubmit}>
              <div className="pmp-form__field">
                <label className="pmp-form__label">ID del cliente (UUID)</label>
                <input
                  className="pmp-form__input"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  required
                />
              </div>

              <div className="pmp-form__row">
                <div className="pmp-form__field">
                  <label className="pmp-form__label">Tipo de operación</label>
                  <select className="pmp-form__select" onChange={(e) => setPreference((p) => ({ ...p, operationType: e.target.value || undefined }))}>
                    <option value="">Cualquiera</option>
                    {Object.entries(OPERATION_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div className="pmp-form__field">
                  <label className="pmp-form__label">Tipo de inmueble</label>
                  <select className="pmp-form__select" onChange={(e) => setPreference((p) => ({ ...p, propertyType: e.target.value || undefined }))}>
                    <option value="">Cualquiera</option>
                    {Object.entries(PROPERTY_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
              </div>

              <div className="pmp-form__row">
                <div className="pmp-form__field">
                  <label className="pmp-form__label">Precio mínimo (USD)</label>
                  <input className="pmp-form__input" type="number" onChange={(e) => setPreference((p) => ({ ...p, minPrice: Number(e.target.value) || undefined }))} />
                </div>
                <div className="pmp-form__field">
                  <label className="pmp-form__label">Precio máximo (USD)</label>
                  <input className="pmp-form__input" type="number" onChange={(e) => setPreference((p) => ({ ...p, maxPrice: Number(e.target.value) || undefined }))} />
                </div>
              </div>

              <div className="pmp-form__row">
                <div className="pmp-form__field">
                  <label className="pmp-form__label">Ciudad preferida</label>
                  <input className="pmp-form__input" onChange={(e) => setPreference((p) => ({ ...p, preferredCity: e.target.value || undefined }))} />
                </div>
                <div className="pmp-form__field">
                  <label className="pmp-form__label">Urgencia</label>
                  <select className="pmp-form__select" onChange={(e) => setPreference((p) => ({ ...p, urgencyLevel: e.target.value as never }))}>
                    <option value="high">Alta</option>
                    <option value="medium">Media</option>
                    <option value="low">Baja</option>
                  </select>
                </div>
              </div>

              {error && <p className="pmp-form__error">⚠ {error}</p>}

              <button type="submit" disabled={loading} className="pmp-form__submit">
                {loading ? '⟳ Ejecutando...' : '✨ Ejecutar matching IA'}
              </button>
            </form>
          </div>
        </div>

        {/* Right panel: results */}
        <div className="pmp-right">
          {!selectedClientId && (
            <div className="pmp-results-empty">
              <span className="pmp-results-empty__icon">✨</span>
              <p className="pmp-results-empty__text">Selecciona un cliente del historial o ejecuta un nuevo matching para ver los resultados.</p>
            </div>
          )}

          {selectedClientId && detailMatches.length > 0 && (
            <div className="pmp-results">
              <div className="pmp-results__header">
                <h3 className="pmp-results__title">{detailMatches.length} propiedades compatibles</h3>
                <span className="pmp-results__client">Cliente: <code>{selectedClientId.slice(0, 16)}…</code></span>
              </div>
              <div className="pmp-results__list">
                {detailMatches.sort((a, b) => b.score - a.score).map((match) => (
                  <div key={match.id} className="pmp-match-card">
                    <div className="pmp-match-card__score-ring" style={{ borderColor: scoreColor(match.score) }}>
                      <span className="pmp-match-card__score-val" style={{ color: scoreColor(match.score) }}>{match.score}</span>
                      <span className="pmp-match-card__score-lbl">/ 100</span>
                    </div>
                    <div className="pmp-match-card__body">
                      <p className="pmp-match-card__prop">🏠 <code>{match.propertyId.slice(0, 12)}…</code></p>
                      {match.matchReason && <p className="pmp-match-card__reason">{match.matchReason}</p>}
                      <div className="pmp-match-card__breakdown">
                        {Object.entries(match.scoreBreakdown).map(([k, v]) => (
                          <span key={k} className="pmp-match-card__breakdown-item">
                            <span className="pmp-match-card__breakdown-key">{k}</span>
                            <span className="pmp-match-card__breakdown-val" style={{ color: scoreColor(v * 3) }}>{v}</span>
                          </span>
                        ))}
                      </div>
                      {match.riskFlags && match.riskFlags.length > 0 && (
                        <p className="pmp-match-card__risk">⚠ {match.riskFlags.map((f) => RESULT_LABELS[f] ?? f).join(', ')}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
