import type { ProviderPort } from '../../core/interfaces/provider.interface.js';

export class LocalPaymentsProvider implements ProviderPort {
  readonly name = 'local-payments';

  isConfigured(): boolean {
    return true;
  }
}
