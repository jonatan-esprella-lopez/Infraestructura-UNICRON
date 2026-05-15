import { ModuleName } from '../../core/enums/module.enum.js';
import type { AppServices } from '../../core/types/api.types.js';
import { createFeatureModule } from '../_shared/feature-module.factory.js';

export function createSettingsModule(services: AppServices) {
  return createFeatureModule(
    {
      basePath: '/settings',
      capabilities: ['feature-flags', 'tenant-preferences', 'provider-config'],
      description: 'Tenant and platform configuration boundary.',
      name: ModuleName.Settings,
    },
    services,
  );
}
