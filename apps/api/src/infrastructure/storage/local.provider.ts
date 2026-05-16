import type { ProviderPort } from '../../core/interfaces/provider.interface.js';

export class LocalStorageProvider implements ProviderPort {
  readonly name = 'local-storage';

  isConfigured(): boolean {
    return true;
  }
}
