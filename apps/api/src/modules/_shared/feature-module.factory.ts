import type { ApplicationModule, AppServices, RouteDefinition } from '../../core/types/api.types.js';
import type { EventHandler } from '../../core/interfaces/event-handler.interface.js';
import type { ModuleName } from '../../core/enums/module.enum.js';
import { ok } from '../../shared/interceptors/response.interceptor.js';

interface FeatureModuleDefinition {
  basePath: string;
  capabilities: string[];
  description: string;
  listeners?: EventHandler[];
  name: ModuleName;
  routes?: RouteDefinition[];
}

export function createFeatureModule(definition: FeatureModuleDefinition, _services: AppServices): ApplicationModule {
  return {
    basePath: definition.basePath,
    listeners: definition.listeners,
    name: definition.name,
    routes: [
      {
        method: 'GET',
        path: definition.basePath,
        handler: () =>
          ok({
            capabilities: definition.capabilities,
            description: definition.description,
            module: definition.name,
            status: 'active',
          }),
      },
      {
        method: 'GET',
        path: `${definition.basePath}/status`,
        handler: () =>
          ok({
            module: definition.name,
            status: 'ready',
          }),
      },
      ...(definition.routes ?? []),
    ],
  };
}
