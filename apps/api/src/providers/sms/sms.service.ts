import type { LoggerLike } from '../../core/types/api.types.js';

export class SmsService {
  constructor(private readonly logger: LoggerLike) {}

  async send(to: string, message: string): Promise<void> {
    this.logger.info('SMS queued', { length: message.length, to });
  }
}
