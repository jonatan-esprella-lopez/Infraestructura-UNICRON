import { useState } from 'react';
import { usePropertyContractReview } from '../../hooks/use-property-contract-review';
import type { ContractRiskLevel } from '../../types/property-contract.types';
import './property-contracts-page.css';

const RISK_COLORS: Record<ContractRiskLevel, string> = {
  low: 'var(--color-success, #10b981)',
  medium: 'var(--color-warning, #f59e0b)',
  high: 'var(--color-danger, #ef4444)',
};

const RISK_LABELS: Record<ContractRiskLevel, string> = {
  low: 'Riesgo bajo',
  medium: 'Riesgo medio',
  high: 'Riesgo alto',
};

export function PropertyContractsPage() {
  const { review, loading, error, reviewWithAi } = usePropertyContractReview();
<<<<<<< HEAD
  const [contractText, setContractText] = useState('');

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractText.trim()) return;
    await reviewWithAi(contractText);
=======
  const [contractId, setContractId] = useState('');

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractId) return;
    await reviewWithAi(contractId);
>>>>>>> origin/exp/pres
  };

  return (
    <section className="property-contracts-page">
      <div className="property-contracts-page__header">
        <p className="property-contracts-page__eyebrow">Proptech — Contratos</p>
        <h2 className="property-contracts-page__title">Revisión de contratos con IA</h2>
        <p className="property-contracts-page__description">
          Análisis preliminar de contratos inmobiliarios mediante inteligencia artificial.
        </p>
      </div>

      <div className="property-contracts-page__disclaimer">
        ⚠ La revisión con IA es preliminar y no reemplaza la revisión de un abogado, notario o profesional legal.
      </div>

      <form className="property-contracts-page__form" onSubmit={handleReview}>
        <div className="property-contracts-page__field">
<<<<<<< HEAD
          <label>Texto del contrato</label>
          <textarea
            value={contractText}
            onChange={(e) => setContractText(e.target.value)}
            placeholder="Pega aqui el contrato completo"
            rows={10}
=======
          <label>ID del contrato</label>
          <input
            value={contractId}
            onChange={(e) => setContractId(e.target.value)}
            placeholder="UUID del contrato"
>>>>>>> origin/exp/pres
            required
          />
        </div>
        <button type="submit" disabled={loading} className="property-contracts-page__submit">
          {loading ? 'Analizando contrato...' : 'Revisar con IA'}
        </button>
      </form>

      {error && <p className="property-contracts-page__error">{error}</p>}

      {review && (
        <div className="property-contracts-page__review">
          <div className="contract-review__risk" style={{ color: RISK_COLORS[review.riskLevel] }}>
            {RISK_LABELS[review.riskLevel]}
          </div>

          <div className="contract-review__section">
            <h4>Resumen</h4>
            <p>{review.summary}</p>
          </div>

          {review.warnings.length > 0 && (
            <div className="contract-review__section">
              <h4>Advertencias</h4>
              <ul>
                {review.warnings.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
          )}

          {review.missingFields.length > 0 && (
            <div className="contract-review__section">
              <h4>Campos faltantes</h4>
              <ul>
                {review.missingFields.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            </div>
          )}

          {review.recommendations.length > 0 && (
            <div className="contract-review__section">
              <h4>Recomendaciones</h4>
              <ul>
                {review.recommendations.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          )}

          <p className="contract-review__disclaimer">{review.disclaimer}</p>
        </div>
      )}
    </section>
  );
}
