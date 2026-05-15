export function formatCurrency(value: number, currency = 'BOB') {
  return new Intl.NumberFormat('es-BO', { style: 'currency', currency }).format(value);
}
