import type { ProviderPort } from '../../core/interfaces/provider.interface.js';

export class MailProvider implements ProviderPort {
  readonly name = 'mail';

  isConfigured(): boolean {
    return Boolean(process.env.MAIL_PROVIDER);
  }
}
