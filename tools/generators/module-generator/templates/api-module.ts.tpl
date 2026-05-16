import { ModuleName } from '../../core/enums/module.enum.js';
import type { AppServices } from '../../core/types/api.types.js';
import { createFeatureModule } from '../_shared/feature-module.factory.js';

export function create{{PascalName}}Module(services: AppServices) {
  return createFeatureModule(
    {
      basePath: '/{{kebabName}}',
      capabilities: ['overview', 'automation-ready'],
      description: '{{PascalName}} module boundary.',
      name: ModuleName.{{PascalName}},
    },
    services,
  );
}
