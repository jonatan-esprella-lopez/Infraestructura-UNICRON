import type { ProviderPort } from '../../core/interfaces/provider.interface.js';

export class TwilioProvider implements ProviderPort {
  readonly name = 'twilio';

  isConfigured(): boolean {
    return Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN);
  }
}
