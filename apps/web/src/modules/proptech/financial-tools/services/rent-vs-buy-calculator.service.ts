import { RentVsBuyCalculatorInput, RentVsBuyCalculatorResult } from '../types/financial-common.types';
import { calculateMonthlyPayment, calculateRemainingLoanBalance } from '../utils/financial-math.util';

export class RentVsBuyCalculatorService {
  static calculate(input: RentVsBuyCalculatorInput): RentVsBuyCalculatorResult {
    // 1. Calculate Rent Cost
    let totalRentCost = 0;
    let currentMonthlyRent = input.currentMonthlyRent;
    for (let year = 1; year <= input.expectedYearsInHome; year++) {
      totalRentCost += currentMonthlyRent * 12;
      currentMonthlyRent *= 1 + input.expectedAnnualRentIncrease / 100;
    }

    // 2. Calculate Buy Cost
    const loanAmount = input.loanAmount > 0 ? input.loanAmount : input.homePrice - input.downPayment;
    const monthlyPayment = calculateMonthlyPayment(loanAmount, input.annualInterestRate, input.loanTermYears);
    const totalMortgagePaid = monthlyPayment * 12 * input.expectedYearsInHome;
    
    const annualMaintenance = input.annualMaintenanceCost ?? (input.homePrice * 0.01); // default 1% of home price
    const totalMaintenance = annualMaintenance * input.expectedYearsInHome;
    const closingCosts = input.closingCosts ?? (input.homePrice * 0.03); // default 3%

    const totalBuyingCost = input.downPayment + totalMortgagePaid + totalMaintenance + closingCosts;

    // 3. Equity and Future Value
    const futurePropertyValue = input.homePrice * Math.pow(1 + input.annualPropertyAppreciation / 100, input.expectedYearsInHome);
    
    const paymentsMade = input.expectedYearsInHome * 12;
    const remainingLoanBalance = calculateRemainingLoanBalance(loanAmount, input.annualInterestRate, input.loanTermYears, paymentsMade);
    
    const sellingCosts = futurePropertyValue * ((input.sellingCostsPercentage ?? 5) / 100);
    const estimatedEquity = futurePropertyValue - remainingLoanBalance - sellingCosts;

    // 4. Net Cost comparison
    // Real cost of buying is all the money you put in MINUS the money you get back (equity)
    const netCostToBuy = totalBuyingCost - estimatedEquity;

    let recommendation: 'buy' | 'rent' | 'neutral' = 'neutral';
    let explanation = '';

    if (netCostToBuy < totalRentCost) {
      recommendation = 'buy';
      explanation = `Comprar podría ahorrarte aproximadamente ${Math.round(totalRentCost - netCostToBuy)} a lo largo de ${input.expectedYearsInHome} años.`;
    } else if (totalRentCost < netCostToBuy) {
      recommendation = 'rent';
      explanation = `Alquilar parece más conveniente financieramente, podrías ahorrar ${Math.round(netCostToBuy - totalRentCost)} en ${input.expectedYearsInHome} años.`;
    } else {
      explanation = 'Ambas opciones tienen un costo financiero similar en este periodo de tiempo.';
    }

    return {
      totalRentCost: Math.round(totalRentCost),
      totalBuyingCost: Math.round(totalBuyingCost),
      futurePropertyValue: Math.round(futurePropertyValue),
      remainingLoanBalance: Math.round(remainingLoanBalance),
      estimatedEquity: Math.round(estimatedEquity),
      breakEvenYear: null, // Harder to calculate iteratively without a loop, we skip it for MVP
      recommendation,
      explanation,
    };
  }
}
