import type { ProviderPort } from '../../core/interfaces/provider.interface.js';

export class GoogleMapsProvider implements ProviderPort {
  readonly name = 'google-maps';

  isConfigured(): boolean {
    return Boolean(process.env.GOOGLE_MAPS_API_KEY);
  }
}
