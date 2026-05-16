import { AppError } from './app.error.js';

export class PermissionError extends AppError {
  constructor(message = 'Permission denied') {
    super(message, 403, 'PERMISSION_ERROR');
    this.name = 'PermissionError';
  }
}
