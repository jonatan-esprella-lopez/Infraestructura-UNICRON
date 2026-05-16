import type { ValuationResultCardProps } from "./valuation-result-card.types";
import { ConfidenceBadge } from "../confidence-badge/confidence-badge";
import { formatCurrency } from "../../utils/format-currency.util";
import "./valuation-result-card.css";

export function ValuationResultCard({ result }: ValuationResultCardProps) {
  return (
    <article className="valuation-result-card">
      <div className="valuation-result-card__header">
        <div>
          <p className="valuation-result-card__eyebrow">
            Estimación generada
          </p>

          <h2 className="valuation-result-card__title">
            Valor estimado del terreno
          </h2>
        </div>

        <ConfidenceBadge level={result.confidenceLevel} />
      </div>

      <div className="valuation-result-card__main-value">
        {formatCurrency(result.estimatedAveragePrice, result.currency)}
      </div>

      <div className="valuation-result-card__range">
        <div className="valuation-result-card__range-item">
          <span className="valuation-result-card__range-label">Mínimo</span>
          <strong className="valuation-result-card__range-value">
            {formatCurrency(result.estimatedMinPrice, result.currency)}
          </strong>
        </div>

        <div className="valuation-result-card__range-item">
          <span className="valuation-result-card__range-label">Máximo</span>
          <strong className="valuation-result-card__range-value">
            {formatCurrency(result.estimatedMaxPrice, result.currency)}
          </strong>
        </div>

        <div className="valuation-result-card__range-item">
          <span className="valuation-result-card__range-label">Precio m²</span>
          <strong className="valuation-result-card__range-value">
            {formatCurrency(result.estimatedPricePerM2, result.currency)}
          </strong>
        </div>
      </div>

      <p className="valuation-result-card__summary">{result.summary}</p>

      {result.warnings.length > 0 && (
        <div className="valuation-result-card__warnings">
          <h3 className="valuation-result-card__warnings-title">
            Advertencias
          </h3>

          <ul className="valuation-result-card__warnings-list">
            {result.warnings.map((warning) => (
              <li className="valuation-result-card__warning" key={warning}>
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
