import { ValidationError } from '../../core/errors/validation.error.js';

export function ensureObject(value: unknown, message = 'Expected object payload'): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new ValidationError(message);
  }

  return value as Record<string, unknown>;
}

export function ensureString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new ValidationError(`${field} is required`);
  }

  return value.trim();
}
