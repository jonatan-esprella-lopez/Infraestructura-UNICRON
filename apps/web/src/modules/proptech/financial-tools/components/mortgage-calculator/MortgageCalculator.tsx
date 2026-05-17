import React, { useState, useEffect } from 'react';
import { MortgageCalculatorInput, MortgageCalculatorResult } from '../../types/financial-common.types';
import { MortgageCalculatorService } from '../../services/mortgage-calculator.service';
import { FinancialSummaryCard } from '../financial-summary-card/FinancialSummaryCard';
import { formatMoney } from '../../utils/format-money.util';

export const MortgageCalculator: React.FC = () => {
  const [input, setInput] = useState<MortgageCalculatorInput>({
    homePrice: 100000,
    downPayment: 20000,
    loanAmount: 0,
    annualInterestRate: 5.5,
    loanTermYears: 20,
    monthlyInsurance: 0,
    monthlyTaxes: 0,
    currency: 'USD',
  });

  const [result, setResult] = useState<MortgageCalculatorResult | null>(null);

  useEffect(() => {
    setResult(MortgageCalculatorService.calculate(input));
  }, [input]);

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  return (
    <div className="fin-calculator">
      <div className="fin-calculator__form">
        <h2 className="fin-calculator__subtitle">Datos del Préstamo</h2>
        
        <div className="fin-form-group">
          <label>Precio de la vivienda ({input.currency})</label>
          <input type="number" name="homePrice" value={input.homePrice} onChange={handleNumberChange} min={0} />
        </div>
        
        <div className="fin-form-group">
          <label>Pago inicial ({input.currency})</label>
          <input type="number" name="downPayment" value={input.downPayment} onChange={handleNumberChange} min={0} />
          <small>{input.homePrice > 0 ? ((input.downPayment / input.homePrice) * 100).toFixed(1) : 0}% del precio total</small>
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
              <option value={25}>25 años</option>
              <option value={30}>30 años</option>
            </select>
          </div>
        </div>

        <h3 className="fin-calculator__subtitle-small">Gastos mensuales adicionales (Opcional)</h3>
        <div className="fin-form-row">
          <div className="fin-form-group">
            <label>Seguro ({input.currency})</label>
            <input type="number" name="monthlyInsurance" value={input.monthlyInsurance} onChange={handleNumberChange} min={0} />
          </div>
          <div className="fin-form-group">
            <label>Impuestos ({input.currency})</label>
            <input type="number" name="monthlyTaxes" value={input.monthlyTaxes} onChange={handleNumberChange} min={0} />
          </div>
        </div>
      </div>

      <div className="fin-calculator__result">
        {result && (
          <FinancialSummaryCard
            title="Resumen del Préstamo"
            primaryLabel="Cuota mensual estimada"
            primaryValue={formatMoney(result.estimatedMonthlyPayment, input.currency)}
            secondaryLabel="Monto Financiado"
            secondaryValue={formatMoney(result.loanAmount, input.currency)}
            explanation={`A lo largo de ${input.loanTermYears} años, pagarás un total de ${formatMoney(result.totalInterestPaid, input.currency)} solo en intereses. El costo total de la compra será de ${formatMoney(result.totalPaid + input.downPayment, input.currency)}.`}
          />
        )}
      </div>
    </div>
  );
};
