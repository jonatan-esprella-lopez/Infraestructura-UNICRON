import { ValidationError } from '../../core/errors/validation.error.js';

export function parseId(value: unknown, field = 'id'): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new ValidationError(`${field} must be a non-empty string`);
  }

  return value.trim();
}
