import { ModuleName } from '../../core/enums/module.enum.js';
import type { AppServices } from '../../core/types/api.types.js';
import { createFeatureModule } from '../_shared/feature-module.factory.js';

export function createPermissionsModule(services: AppServices) {
  return createFeatureModule(
    {
      basePath: '/permissions',
      capabilities: ['permission-catalog', 'policy-checks'],
      description: 'Permission catalog and policy checks.',
      name: ModuleName.Permissions,
    },
    services,
  );
}
