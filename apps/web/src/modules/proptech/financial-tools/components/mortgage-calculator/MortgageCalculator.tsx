import React, { useState, useEffect } from 'react';
import { MortgageCalculatorInput, MortgageCalculatorResult } from '../../types/financial-common.types';
import { MortgageCalculatorService } from '../../services/mortgage-calculator.service';
import { FinancialSummaryCard } from '../financial-summary-card/FinancialSummaryCard';
import { formatMoney } from '../../utils/format-money.util';

export const MortgageCalculator: React.FC = () => {
  const [input, setInput] = useState<Record<string, any>>({
    homePrice: '',
    downPayment: '',
    loanAmount: '',
    annualInterestRate: '',
    loanTermYears: 20,
    monthlyInsurance: '',
    monthlyTaxes: '',
    currency: 'USD',
  });

  const [result, setResult] = useState<MortgageCalculatorResult | null>(null);

  useEffect(() => {
    const parsedInput: MortgageCalculatorInput = {
      homePrice: Number(input.homePrice) || 0,
      downPayment: Number(input.downPayment) || 0,
      loanAmount: Number(input.loanAmount) || 0,
      annualInterestRate: Number(input.annualInterestRate) || 0,
      loanTermYears: Number(input.loanTermYears) || 20,
      monthlyInsurance: Number(input.monthlyInsurance) || 0,
      monthlyTaxes: Number(input.monthlyTaxes) || 0,
      currency: input.currency as any,
    };
    
    // Only calculate if main fields are filled
    if (parsedInput.homePrice > 0 && parsedInput.annualInterestRate > 0) {
      setResult(MortgageCalculatorService.calculate(parsedInput));
    } else {
      setResult(null);
    }
  }, [input]);

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value === '' ? '' : parseFloat(value) }));
  };

  return (
    <div className="fin-calculator">
      <div className="fin-calculator__form">
        <h2 className="fin-calculator__subtitle">Datos del Préstamo</h2>
        
        <div className="fin-form-group">
          <label>Precio de la vivienda ({input.currency})</label>
          <input type="number" name="homePrice" value={input.homePrice} onChange={handleNumberChange} min={0} placeholder="Ej: 100000" />
        </div>
        
        <div className="fin-form-group">
          <label>Pago inicial ({input.currency})</label>
          <input type="number" name="downPayment" value={input.downPayment} onChange={handleNumberChange} min={0} placeholder="Ej: 20000" />
          <small>{Number(input.homePrice) > 0 ? ((Number(input.downPayment) / Number(input.homePrice)) * 100).toFixed(1) : 0}% del precio total</small>
        </div>

        <div className="fin-form-row">
          <div className="fin-form-group">
            <label>Tasa de interés (%)</label>
            <input type="number" name="annualInterestRate" value={input.annualInterestRate} onChange={handleNumberChange} min={0} step="0.1" placeholder="Ej: 5.5" />
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
            <input type="number" name="monthlyInsurance" value={input.monthlyInsurance} onChange={handleNumberChange} min={0} placeholder="Ej: 50" />
          </div>
          <div className="fin-form-group">
            <label>Impuestos ({input.currency})</label>
            <input type="number" name="monthlyTaxes" value={input.monthlyTaxes} onChange={handleNumberChange} min={0} placeholder="Ej: 80" />
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
            explanation={`A lo largo de ${input.loanTermYears} años, pagarás un total de ${formatMoney(result.totalInterestPaid, input.currency)} solo en intereses. El costo total de la compra será de ${formatMoney(result.totalPaid + Number(input.downPayment), input.currency)}.`}
          />
        )}
        {!result && (
          <div style={{ color: '#64748b', textAlign: 'center', padding: '2rem 0' }}>
            Ingresa el precio de la vivienda y la tasa de interés para ver el cálculo.
          </div>
        )}
      </div>
    </div>
  );
};
