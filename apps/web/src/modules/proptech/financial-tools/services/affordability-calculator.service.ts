import { AffordabilityCalculatorInput, AffordabilityCalculatorResult } from '../types/financial-common.types';
import { calculateMaxLoanAmount } from '../utils/financial-math.util';

export class AffordabilityCalculatorService {
  static calculate(input: AffordabilityCalculatorInput): AffordabilityCalculatorResult {
    const totalMonthlyIncome = input.grossMonthlyIncome + input.additionalMonthlyIncome;
    const maxMonthlyDebtCapacity = totalMonthlyIncome * (input.maxDebtToIncomeRatio / 100);
    
    // Lo que realmente puede pagar de hipoteca es su capacidad menos las deudas actuales
    const recommendedMonthlyPayment = Math.max(0, maxMonthlyDebtCapacity - input.monthlyDebts);

    const maxLoanAmount = calculateMaxLoanAmount(
      recommendedMonthlyPayment,
      input.annualInterestRate,
      input.loanTermYears
    );

    const maxHomePrice = maxLoanAmount + input.expectedDownPayment;

    // Calcular nivel de riesgo basado en el porcentaje que representa la hipoteca
    const mortgagePercentage = (recommendedMonthlyPayment / totalMonthlyIncome) * 100;
    
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (mortgagePercentage > 35) {
      riskLevel = 'high';
    } else if (mortgagePercentage > 25) {
      riskLevel = 'medium';
    }

    return {
      totalMonthlyIncome,
      recommendedMonthlyPayment: Math.round(recommendedMonthlyPayment),
      maxLoanAmount: Math.round(maxLoanAmount),
      maxHomePrice: Math.round(maxHomePrice),
      debtToIncomeRatio: input.maxDebtToIncomeRatio,
      riskLevel,
    };
  }
}
