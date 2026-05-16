import { ensureObject, ensureString } from '../pipes/validation.pipe.js';

export function validateCreateUserPayload(value: unknown): { email: string; name: string } {
  const body = ensureObject(value);

  return {
    email: ensureString(body.email, 'email'),
    name: ensureString(body.name, 'name'),
  };
}
