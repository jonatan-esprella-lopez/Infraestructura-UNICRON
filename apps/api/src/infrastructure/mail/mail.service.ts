import type { LoggerLike, MailLike } from '../../core/types/api.types.js';

export class MailService implements MailLike {
  constructor(private readonly logger: LoggerLike) {}

  async send(input: { to: string; subject: string; template: string; data?: Record<string, unknown> }): Promise<void> {
    this.logger.info('Mail queued', {
      subject: input.subject,
      template: input.template,
      to: input.to,
    });
  }
}
