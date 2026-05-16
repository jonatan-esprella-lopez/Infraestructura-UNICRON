import type { ValuationFactorResult } from "../../types/land-valuation.types";
import { formatCurrency } from "../../utils/format-currency.util";
import "./valuation-factor-list.css";

interface ValuationFactorListProps {
  factors: ValuationFactorResult[];
}

export function ValuationFactorList({ factors }: ValuationFactorListProps) {
  if (factors.length === 0) {
    return null;
  }

  return (
    <section className="valuation-factor-list">
      <header className="valuation-factor-list__header">
        <h3 className="valuation-factor-list__title">
          Factores aplicados
        </h3>
      </header>

      <ul className="valuation-factor-list__items">
        {factors.map((factor) => (
          <li
            key={factor.key}
            className={`valuation-factor-list__item valuation-factor-list__item--${factor.type}`}
          >
            <div className="valuation-factor-list__content">
              <div className="valuation-factor-list__header-row">
                <strong className="valuation-factor-list__label">
                  {factor.label}
                </strong>
                <span className="valuation-factor-list__impact">
                  {factor.type === "positive" ? "+" : ""}
                  {factor.impactPercentage}% (
                  {formatCurrency(factor.impactAmount, "USD")})
                </span>
              </div>
              <p className="valuation-factor-list__reason">{factor.reason}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
