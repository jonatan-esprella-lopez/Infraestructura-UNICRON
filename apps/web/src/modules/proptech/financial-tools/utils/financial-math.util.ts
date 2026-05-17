export function calculateMonthlyPayment(
  principal: number,
  annualInterestRate: number,
  termYears: number
): number {
  const monthlyRate = annualInterestRate / 100 / 12;
  const numberOfPayments = termYears * 12;

  if (monthlyRate === 0) {
    return principal / numberOfPayments;
  }

  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
  );
}

export function calculateMaxLoanAmount(
  monthlyPaymentTarget: number,
  annualInterestRate: number,
  termYears: number
): number {
  const monthlyRate = annualInterestRate / 100 / 12;
  const numberOfPayments = termYears * 12;

  if (monthlyRate === 0) {
    return monthlyPaymentTarget * numberOfPayments;
  }

  return (
    (monthlyPaymentTarget * (Math.pow(1 + monthlyRate, numberOfPayments) - 1)) /
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))
  );
}

export function calculateRemainingLoanBalance(
  principal: number,
  annualInterestRate: number,
  termYears: number,
  paymentsMade: number
): number {
  const monthlyRate = annualInterestRate / 100 / 12;
  const numberOfPayments = termYears * 12;

  if (monthlyRate === 0) {
    return Math.max(0, principal - (principal / numberOfPayments) * paymentsMade);
  }

  const r1n = Math.pow(1 + monthlyRate, numberOfPayments);
  const r1p = Math.pow(1 + monthlyRate, paymentsMade);

  return principal * ((r1n - r1p) / (r1n - 1));
}
