import { ModuleName } from '../../core/enums/module.enum.js';
import type { AppServices } from '../../core/types/api.types.js';
import { createFeatureModule } from '../_shared/feature-module.factory.js';

export function createUsersModule(services: AppServices) {
  return createFeatureModule(
    {
      basePath: '/users',
      capabilities: ['profiles', 'tenant-membership', 'user-audit'],
      description: 'User profile and membership management.',
      name: ModuleName.Users,
    },
    services,
  );
}
