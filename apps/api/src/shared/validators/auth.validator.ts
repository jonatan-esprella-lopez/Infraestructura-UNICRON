import { ensureObject, ensureString } from '../pipes/validation.pipe.js';

export function validateLoginPayload(value: unknown): { email: string; password: string } {
  const body = ensureObject(value);

  return {
    email: ensureString(body.email, 'email'),
    password: ensureString(body.password, 'password'),
  };
}
