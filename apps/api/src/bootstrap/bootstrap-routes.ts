import type { ApiApplication } from '../app.js';
import type { AppConfig, AppServices, RouteDefinition } from '../core/types/api.types.js';
import { createModules } from '../modules/index.js';

export function bootstrapRoutes(app: ApiApplication, config: AppConfig, services: AppServices): void {
  app.registerMany(createHealthRoutes());

  const modules = createModules(services);

  modules.forEach((module) => {
    module.listeners?.forEach((listener) => services.eventBus.subscribe(listener.eventName, listener.handle));
    app.registerMany(module.routes.map((route) => prefixRoute(config.apiPrefix, route)));
    services.logger.info('Module registered', { module: module.name, basePath: module.basePath });
  });
}

function createHealthRoutes(): RouteDefinition[] {
  return [
    {
      method: 'GET',
      path: '/live',
      handler: () => ({
        body: { status: 'live' },
      }),
    },
    {
      method: 'GET',
      path: '/ready',
      handler: async ({ services }) => ({
        body: await services.healthcheck.ready(),
      }),
    },
    {
      method: 'GET',
      path: '/health',
      handler: async ({ services }) => ({
        body: await services.healthcheck.health(),
      }),
    },
    {
      method: 'GET',
      path: '/metrics',
      handler: ({ services }) => ({
        body: services.metrics.snapshot(),
      }),
    },
  ];
}

function prefixRoute(prefix: string, route: RouteDefinition): RouteDefinition {
  return {
    ...route,
    path: `${prefix}${route.path}`,
  };
}
