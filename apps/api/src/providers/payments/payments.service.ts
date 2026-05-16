import type { LoggerLike } from '../../core/types/api.types.js';

export class PaymentsService {
  constructor(private readonly logger: LoggerLike) {}

  async createCharge(amount: number, currency: string): Promise<{ id: string; status: string }> {
    this.logger.info('Payment charge requested', { amount, currency });
    return { id: `pay_${Date.now()}`, status: 'pending' };
  }
}
