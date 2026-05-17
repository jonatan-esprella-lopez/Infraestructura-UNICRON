import { Currency } from '../types/financial-common.types';

export function formatMoney(amount: number, currency: Currency = 'USD'): string {
  return new Intl.NumberFormat(currency === 'BOB' ? 'es-BO' : 'en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
