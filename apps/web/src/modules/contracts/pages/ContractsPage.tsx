import { useState } from 'react';
import { environment } from '@bootstrap/environment';
import './ContractsPage.css';

const API = environment.agentsApiUrl;

interface Flag {
  clause_id: string;
  text_excerpt: string;
  issue: string;
  recommendation: string;
}

interface Analysis {
  operation_type: string;
  summary: { red_count: number; yellow_count: number; green_count: number; missing_count: number };
  red_flags: Flag[];
  yellow_flags: Flag[];
  green: Flag[];
  missing_required: Flag[];
}

export function ContractsPage() {
  const [text, setText] = useState('');
  const [operationType, setOperationType] = useState('alquiler');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleAnalyze() {
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const resp = await fetch(`${API}/contracts/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, operation_type: operationType }),
      });
      if (!resp.ok) throw new Error(`Error ${resp.status}`);
      setAnalysis(await resp.json());
    } catch {
      setError('No se pudo conectar con el servidor de agentes.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="contracts">
      <div className="contracts__header">
        <p className="contracts__eyebrow">CasaLens · Contract Reviewer</p>
        <h2 className="contracts__title">Revisión de contrato</h2>
        <p className="contracts__subtitle">Pegá el texto del contrato y detectamos cláusulas problemáticas.</p>
      </div>

      <div className="contracts__form">
        <select
          className="contracts__select"
          value={operationType}
          onChange={(e) => setOperationType(e.target.value)}
        >
          <option value="alquiler">Alquiler</option>
          <option value="anticretico">Anticrético</option>
          <option value="venta">Venta</option>
        </select>

        <textarea
          className="contracts__textarea"
          placeholder="Pegá el texto completo del contrato aquí..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={12}
        />

        <button className="contracts__btn" onClick={handleAnalyze} disabled={loading || !text.trim()}>
          {loading ? 'Analizando...' : 'Analizar contrato'}
        </button>

        {error && <p className="contracts__error">{error}</p>}
      </div>

      {analysis && (
        <div className="contracts__results">
          <div className="contracts__summary">
            <div className="summary-pill summary-pill--red">🚨 {analysis.summary.red_count} críticas</div>
            <div className="summary-pill summary-pill--yellow">⚠️ {analysis.summary.yellow_count} observaciones</div>
            <div className="summary-pill summary-pill--green">✅ {analysis.summary.green_count} correctas</div>
            <div className="summary-pill summary-pill--missing">📋 {analysis.summary.missing_count} faltantes</div>
          </div>

          {analysis.red_flags.length > 0 && (
            <FlagSection title="Cláusulas críticas" flags={analysis.red_flags} variant="red" />
          )}
          {analysis.missing_required.length > 0 && (
            <FlagSection title="Elementos faltantes" flags={analysis.missing_required} variant="missing" />
          )}
          {analysis.yellow_flags.length > 0 && (
            <FlagSection title="Observaciones" flags={analysis.yellow_flags} variant="yellow" />
          )}
          {analysis.green.length > 0 && (
            <FlagSection title="Cláusulas correctas" flags={analysis.green} variant="green" />
          )}
        </div>
      )}
    </section>
  );
}

function FlagSection({ title, flags, variant }: { title: string; flags: Flag[]; variant: string }) {
  return (
    <div className={`flag-section flag-section--${variant}`}>
      <h3 className="flag-section__title">{title}</h3>
      <div className="flag-section__list">
        {flags.map((f) => (
          <article key={f.clause_id} className="flag-card">
            <span className="flag-card__id">{f.clause_id}</span>
            {f.text_excerpt && f.text_excerpt !== '(no encontrado en el contrato)' && (
              <blockquote className="flag-card__excerpt">"{f.text_excerpt}"</blockquote>
            )}
            <p className="flag-card__issue">{f.issue}</p>
            {f.recommendation && (
              <p className="flag-card__rec">💡 {f.recommendation}</p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
