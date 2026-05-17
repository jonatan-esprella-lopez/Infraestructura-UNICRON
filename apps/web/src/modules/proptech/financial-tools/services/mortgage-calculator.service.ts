import { MortgageCalculatorInput, MortgageCalculatorResult } from '../types/financial-common.types';
import { calculateMonthlyPayment } from '../utils/financial-math.util';

export class MortgageCalculatorService {
  static calculate(input: MortgageCalculatorInput): MortgageCalculatorResult {
    const loanAmount = input.loanAmount > 0 ? input.loanAmount : input.homePrice - input.downPayment;

    const monthlyPrincipalAndInterest = calculateMonthlyPayment(
      loanAmount,
      input.annualInterestRate,
      input.loanTermYears
    );

    const estimatedMonthlyPayment =
      monthlyPrincipalAndInterest + (input.monthlyInsurance ?? 0) + (input.monthlyTaxes ?? 0);

    const totalPaid = monthlyPrincipalAndInterest * input.loanTermYears * 12;
    const totalInterestPaid = totalPaid - loanAmount;

    return {
      monthlyPrincipalAndInterest: Math.round(monthlyPrincipalAndInterest),
      estimatedMonthlyPayment: Math.round(estimatedMonthlyPayment),
      totalInterestPaid: Math.round(totalInterestPaid),
      totalPaid: Math.round(totalPaid),
      loanAmount: Math.round(loanAmount),
      downPaymentPercentage: input.homePrice > 0 ? Math.round((input.downPayment / input.homePrice) * 100) : 0,
    };
  }
}
