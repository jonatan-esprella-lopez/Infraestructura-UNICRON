import { ModuleName } from '../../core/enums/module.enum.js';
import type { AppServices } from '../../core/types/api.types.js';
import { createFeatureModule } from '../_shared/feature-module.factory.js';

export function createAuthModule(services: AppServices) {
  return createFeatureModule(
    {
      basePath: '/auth',
      capabilities: ['jwt-access', 'refresh-tokens', 'session-revocation', 'api-keys'],
      description: 'Authentication and session boundary for users and integrations.',
      name: ModuleName.Auth,
    },
    services,
  );
}
