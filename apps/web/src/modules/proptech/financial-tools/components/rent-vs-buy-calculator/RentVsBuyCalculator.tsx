import React, { useState, useEffect } from 'react';
import { RentVsBuyCalculatorInput, RentVsBuyCalculatorResult } from '../../types/financial-common.types';
import { RentVsBuyCalculatorService } from '../../services/rent-vs-buy-calculator.service';
import { FinancialSummaryCard } from '../financial-summary-card/FinancialSummaryCard';
import { formatMoney } from '../../utils/format-money.util';

export const RentVsBuyCalculator: React.FC = () => {
  const [input, setInput] = useState<RentVsBuyCalculatorInput>({
    currentMonthlyRent: 500,
    expectedAnnualRentIncrease: 2,
    homePrice: 100000,
    downPayment: 20000,
    loanAmount: 0,
    annualInterestRate: 5.5,
    loanTermYears: 20,
    annualPropertyAppreciation: 1.5,
    expectedYearsInHome: 5,
    annualMaintenanceCost: 1000,
    closingCosts: 3000,
    sellingCostsPercentage: 5,
    currency: 'USD',
  });

  const [result, setResult] = useState<RentVsBuyCalculatorResult | null>(null);

  useEffect(() => {
    setResult(RentVsBuyCalculatorService.calculate(input));
  }, [input]);

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const getRecommendationLabel = (rec: string) => {
    if (rec === 'buy') return 'Comprar';
    if (rec === 'rent') return 'Alquilar';
    return 'Indiferente';
  };

  const getRiskFromRec = (rec: string): 'low' | 'medium' | 'high' => {
    if (rec === 'buy') return 'low';
    if (rec === 'rent') return 'high';
    return 'medium';
  };

  return (
    <div className="fin-calculator">
      <div className="fin-calculator__form">
        <h2 className="fin-calculator__subtitle">Datos de Alquiler</h2>
        <div className="fin-form-row">
          <div className="fin-form-group">
            <label>Alquiler Mensual ({input.currency})</label>
            <input type="number" name="currentMonthlyRent" value={input.currentMonthlyRent} onChange={handleNumberChange} min={0} />
          </div>
          <div className="fin-form-group">
            <label>Aumento Anual (%)</label>
            <input type="number" name="expectedAnnualRentIncrease" value={input.expectedAnnualRentIncrease} onChange={handleNumberChange} min={0} step="0.1" />
          </div>
        </div>

        <h3 className="fin-calculator__subtitle-small">Datos de Compra</h3>
        <div className="fin-form-row">
          <div className="fin-form-group">
            <label>Precio de Vivienda ({input.currency})</label>
            <input type="number" name="homePrice" value={input.homePrice} onChange={handleNumberChange} min={0} />
          </div>
          <div className="fin-form-group">
            <label>Pago Inicial ({input.currency})</label>
            <input type="number" name="downPayment" value={input.downPayment} onChange={handleNumberChange} min={0} />
          </div>
        </div>

        <div className="fin-form-row">
          <div className="fin-form-group">
            <label>Tasa de interés (%)</label>
            <input type="number" name="annualInterestRate" value={input.annualInterestRate} onChange={handleNumberChange} min={0} step="0.1" />
          </div>
          <div className="fin-form-group">
            <label>Plazo (años)</label>
            <select name="loanTermYears" value={input.loanTermYears} onChange={(e) => setInput(prev => ({ ...prev, loanTermYears: parseInt(e.target.value) }))}>
              <option value={10}>10 años</option>
              <option value={15}>15 años</option>
              <option value={20}>20 años</option>
              <option value={30}>30 años</option>
            </select>
          </div>
        </div>

        <h3 className="fin-calculator__subtitle-small">Proyección</h3>
        <div className="fin-form-group">
          <label>Años previstos viviendo en la casa</label>
          <input type="number" name="expectedYearsInHome" value={input.expectedYearsInHome} onChange={handleNumberChange} min={1} max={input.loanTermYears} />
        </div>
      </div>

      <div className="fin-calculator__result">
        {result && (
          <FinancialSummaryCard
            title="¿Alquilar o Comprar?"
            primaryLabel="Recomendación Financiera"
            primaryValue={getRecommendationLabel(result.recommendation)}
            risk={{
              level: getRiskFromRec(result.recommendation),
              label: getRecommendationLabel(result.recommendation) === 'Comprar' ? 'Favorable para compra' : (getRecommendationLabel(result.recommendation) === 'Alquilar' ? 'Favorable para alquiler' : 'Equilibrado'),
              message: ''
            }}
            explanation={result.explanation}
          />
        )}
        
        {result && (
          <div className="fin-comparison-stats">
            <div className="fin-stat-box">
              <span>Costo total alquilando</span>
              <strong>{formatMoney(result.totalRentCost, input.currency)}</strong>
            </div>
            <div className="fin-stat-box">
              <span>Costo neto comprando</span>
              <strong>{formatMoney(result.totalBuyingCost - result.estimatedEquity, input.currency)}</strong>
              <small>(incluye recuperación de capital)</small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
