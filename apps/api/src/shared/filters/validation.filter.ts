import { ValidationError } from '../../core/errors/validation.error.js';

export function validationDetails(field: string, message: string): ValidationError {
  return new ValidationError('Validation failed', { field, message });
}
