import type { ProviderPort } from '../../core/interfaces/provider.interface.js';

export class StripeProvider implements ProviderPort {
  readonly name = 'stripe';

  isConfigured(): boolean {
    return Boolean(process.env.STRIPE_SECRET_KEY);
  }
}
