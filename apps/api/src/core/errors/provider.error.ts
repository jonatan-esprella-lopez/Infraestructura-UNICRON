import { AppError } from './app.error.js';

export class ProviderError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 502, 'PROVIDER_ERROR', details);
    this.name = 'ProviderError';
  }
}
