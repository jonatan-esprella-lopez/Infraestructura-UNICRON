import { ModuleName } from '../../core/enums/module.enum.js';
import type { AppServices } from '../../core/types/api.types.js';
import { createFeatureModule } from '../_shared/feature-module.factory.js';

export function createGeolocationModule(services: AppServices) {
  return createFeatureModule(
    {
      basePath: '/geolocation',
      capabilities: ['geocoding', 'map-provider', 'location-events'],
      description: 'Geolocation provider integration boundary.',
      name: ModuleName.Geolocation,
    },
    services,
  );
}
