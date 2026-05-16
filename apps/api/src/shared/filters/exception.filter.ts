import { AppError } from '../../core/errors/app.error.js';

export function normalizeException(error: unknown): AppError {
  return error instanceof AppError
    ? error
    : new AppError('Unexpected server error', 500, 'INTERNAL_SERVER_ERROR', { cause: String(error) });
}
