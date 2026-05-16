export function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat('es-BO', { dateStyle: 'medium' }).format(new Date(value));
}
