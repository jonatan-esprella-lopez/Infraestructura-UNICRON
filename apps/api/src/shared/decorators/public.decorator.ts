import type { RouteDefinition } from '../../core/types/api.types.js';

export function publicRoute(route: RouteDefinition): RouteDefinition {
  return { ...route, public: true };
}
