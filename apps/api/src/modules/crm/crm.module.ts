import type { ApplicationModule, AppServices } from '../../core/types/api.types.js';
import { ModuleName } from '../../core/enums/module.enum.js';
import { PrismaCrmRepository } from './infrastructure/repositories/prisma-crm.repository.js';
import { createCrmRoutes } from './presentation/routes/crm.routes.js';

export function createCrmModule(_services: AppServices): ApplicationModule {
  const repository = new PrismaCrmRepository();

  return {
    basePath: '/crm',
    name: ModuleName.Crm,
    routes: createCrmRoutes(repository),
  };
}
