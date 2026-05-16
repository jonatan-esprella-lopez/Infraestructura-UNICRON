export function formatNumber(value: number) {
  return new Intl.NumberFormat('es-BO').format(value);
}
