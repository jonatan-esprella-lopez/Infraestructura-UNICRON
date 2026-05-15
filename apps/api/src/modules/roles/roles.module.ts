import { ModuleName } from '../../core/enums/module.enum.js';
import type { AppServices } from '../../core/types/api.types.js';
import { createFeatureModule } from '../_shared/feature-module.factory.js';

export function createRolesModule(services: AppServices) {
  return createFeatureModule(
    {
      basePath: '/roles',
      capabilities: ['role-catalog', 'role-assignment'],
      description: 'Role catalog and assignment rules.',
      name: ModuleName.Roles,
    },
    services,
  );
}
