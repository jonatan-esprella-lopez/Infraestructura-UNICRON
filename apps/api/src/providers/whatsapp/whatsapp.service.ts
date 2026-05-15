import type { LoggerLike } from '../../core/types/api.types.js';

export class WhatsAppService {
  constructor(private readonly logger: LoggerLike) {}

  async send(to: string, message: string): Promise<void> {
    this.logger.info('WhatsApp message queued', { length: message.length, to });
  }
}
