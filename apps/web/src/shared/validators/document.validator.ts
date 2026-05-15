export function validateDocumentName(name: string) {
  return /\.(pdf|docx|png|jpg|jpeg)$/i.test(name);
}
