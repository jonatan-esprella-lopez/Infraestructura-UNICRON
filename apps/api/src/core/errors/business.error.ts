import { AppError } from './app.error.js';

export class BusinessError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 422, 'BUSINESS_ERROR', details);
    this.name = 'BusinessError';
  }
}
