export type Currency = 'USD' | 'BOB';

export interface MoneyValue {
  amount: number;
  currency: Currency;
}

export interface FinancialRisk {
  level: 'low' | 'medium' | 'high';
  label: string;
  message: string;
}

export interface MortgageCalculatorInput {
  homePrice: number;
  downPayment: number;
  loanAmount: number;
  annualInterestRate: number;
  loanTermYears: number;
  monthlyInsurance?: number;
  monthlyTaxes?: number;
  currency: Currency;
}

export interface MortgageCalculatorResult {
  monthlyPrincipalAndInterest: number;
  estimatedMonthlyPayment: number;
  totalInterestPaid: number;
  totalPaid: number;
  loanAmount: number;
  downPaymentPercentage: number;
}

export interface AffordabilityCalculatorInput {
  grossMonthlyIncome: number;
  additionalMonthlyIncome: number;
  monthlyDebts: number;
  expectedDownPayment: number;
  annualInterestRate: number;
  loanTermYears: number;
  maxDebtToIncomeRatio: number;
  currency: Currency;
}

export interface AffordabilityCalculatorResult {
  totalMonthlyIncome: number;
  recommendedMonthlyPayment: number;
  maxLoanAmount: number;
  maxHomePrice: number;
  debtToIncomeRatio: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface RentVsBuyCalculatorInput {
  currentMonthlyRent: number;
  expectedAnnualRentIncrease: number;

  homePrice: number;
  downPayment: number;
  loanAmount: number;
  annualInterestRate: number;
  loanTermYears: number;

  annualPropertyAppreciation: number;
  expectedYearsInHome: number;
  annualMaintenanceCost?: number;
  closingCosts?: number;
  sellingCostsPercentage?: number;

  currency: Currency;
}

export interface RentVsBuyCalculatorResult {
  totalRentCost: number;
  totalBuyingCost: number;
  futurePropertyValue: number;
  remainingLoanBalance: number;
  estimatedEquity: number;
  breakEvenYear: number | null;
  recommendation: 'rent' | 'buy' | 'neutral';
  explanation: string;
}
