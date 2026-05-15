import { ModuleName } from '../../core/enums/module.enum.js';
import type { AppServices } from '../../core/types/api.types.js';
import { createFeatureModule } from '../_shared/feature-module.factory.js';

export function createTenantsModule(services: AppServices) {
  return createFeatureModule(
    {
      basePath: '/tenants',
      capabilities: ['tenant-isolation', 'tenant-settings', 'tenant-audit'],
      description: 'Multi-tenant ownership, settings, and isolation boundary.',
      name: ModuleName.Tenants,
    },
    services,
  );
}
