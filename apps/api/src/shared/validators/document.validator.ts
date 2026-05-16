import { ensureObject, ensureString } from '../pipes/validation.pipe.js';

export function validateDocumentPayload(value: unknown): { title: string } {
  const body = ensureObject(value);

  return {
    title: ensureString(body.title, 'title'),
  };
}
