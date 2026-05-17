import React from 'react';
import './FinancialSummaryCard.css';
import { FinancialRisk } from '../../types/financial-common.types';

interface FinancialSummaryCardProps {
  title: string;
  primaryLabel: string;
  primaryValue: string;
  secondaryLabel?: string;
  secondaryValue?: string;
  risk?: FinancialRisk;
  explanation?: string;
  actionText?: string;
  onAction?: () => void;
}

export const FinancialSummaryCard: React.FC<FinancialSummaryCardProps> = ({
  title,
  primaryLabel,
  primaryValue,
  secondaryLabel,
  secondaryValue,
  risk,
  explanation,
  actionText,
  onAction,
}) => {
  return (
    <div className="fin-summary-card">
      <h3 className="fin-summary-card__title">{title}</h3>
      
      <div className="fin-summary-card__content">
        <div className="fin-summary-card__primary">
          <span className="fin-summary-card__label">{primaryLabel}</span>
          <span className="fin-summary-card__value">{primaryValue}</span>
        </div>

        {secondaryLabel && secondaryValue && (
          <div className="fin-summary-card__secondary">
            <span className="fin-summary-card__label">{secondaryLabel}</span>
            <span className="fin-summary-card__value-small">{secondaryValue}</span>
          </div>
        )}

        {risk && (
          <div className={`fin-summary-card__risk fin-summary-card__risk--${risk.level}`}>
            <span className="fin-summary-card__risk-label">Riesgo: {risk.label}</span>
          </div>
        )}

        {explanation && (
          <p className="fin-summary-card__explanation">{explanation}</p>
        )}
      </div>

      {actionText && onAction && (
        <button className="fin-summary-card__btn" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
};
