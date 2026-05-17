import React, { useState, useEffect } from 'react';
import { AffordabilityCalculatorInput, AffordabilityCalculatorResult } from '../../types/financial-common.types';
import { AffordabilityCalculatorService } from '../../services/affordability-calculator.service';
import { FinancialSummaryCard } from '../financial-summary-card/FinancialSummaryCard';
import { formatMoney } from '../../utils/format-money.util';

export const AffordabilityCalculator: React.FC = () => {
  const [input, setInput] = useState<AffordabilityCalculatorInput>({
    grossMonthlyIncome: 5000,
    additionalMonthlyIncome: 0,
    monthlyDebts: 500,
    expectedDownPayment: 20000,
    annualInterestRate: 5.5,
    loanTermYears: 20,
    maxDebtToIncomeRatio: 35,
    currency: 'USD',
  });

  const [result, setResult] = useState<AffordabilityCalculatorResult | null>(null);

  useEffect(() => {
    setResult(AffordabilityCalculatorService.calculate(input));
  }, [input]);

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const getRiskLabel = (level: string) => {
    if (level === 'low') return 'Bajo';
    if (level === 'medium') return 'Moderado';
    return 'Alto';
  };

  return (
    <div className="fin-calculator">
      <div className="fin-calculator__form">
        <h2 className="fin-calculator__subtitle">Datos Financieros</h2>
        
        <div className="fin-form-row">
          <div className="fin-form-group">
            <label>Ingreso Mensual Bruto ({input.currency})</label>
            <input type="number" name="grossMonthlyIncome" value={input.grossMonthlyIncome} onChange={handleNumberChange} min={0} />
          </div>
          <div className="fin-form-group">
            <label>Deudas Mensuales ({input.currency})</label>
            <input type="number" name="monthlyDebts" value={input.monthlyDebts} onChange={handleNumberChange} min={0} />
          </div>
        </div>
        
        <div className="fin-form-group">
          <label>Ahorro para Pago Inicial ({input.currency})</label>
          <input type="number" name="expectedDownPayment" value={input.expectedDownPayment} onChange={handleNumberChange} min={0} />
        </div>

        <h3 className="fin-calculator__subtitle-small">Condiciones del Préstamo Esperadas</h3>
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
              <option value={25}>25 años</option>
              <option value={30}>30 años</option>
            </select>
          </div>
        </div>
      </div>

      <div className="fin-calculator__result">
        {result && (
          <FinancialSummaryCard
            title="Capacidad de Compra"
            primaryLabel="Precio Máximo de Propiedad"
            primaryValue={formatMoney(result.maxHomePrice, input.currency)}
            secondaryLabel="Monto Máximo de Préstamo"
            secondaryValue={formatMoney(result.maxLoanAmount, input.currency)}
            risk={{
              level: result.riskLevel,
              label: getRiskLabel(result.riskLevel),
              message: ''
            }}
            explanation={`Con tus ingresos actuales y asumiendo un nivel de endeudamiento del ${input.maxDebtToIncomeRatio}%, la cuota mensual máxima que deberías asumir es de ${formatMoney(result.recommendedMonthlyPayment, input.currency)}.`}
          />
        )}
      </div>
    </div>
  );
};
