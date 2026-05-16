import { ValidationError } from '../../../../core/errors/validation.error.js';

export class LeadScore {
  private constructor(readonly value: number) {}

  static create(value: number): LeadScore {
    if (!Number.isFinite(value) || value < 0 || value > 100) {
      throw new ValidationError('Lead score must be between 0 and 100');
    }

    return new LeadScore(Math.round(value));
  }
}
