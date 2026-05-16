import type { ProviderPort } from '../../core/interfaces/provider.interface.js';

export class WhatsAppProvider implements ProviderPort {
  readonly name = 'whatsapp';

  isConfigured(): boolean {
    return Boolean(process.env.WHATSAPP_TOKEN);
  }
}
