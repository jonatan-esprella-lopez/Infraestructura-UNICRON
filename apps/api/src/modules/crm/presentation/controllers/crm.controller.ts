import type { RouteDefinition } from '../../../../core/types/api.types.js';
import { ModuleName } from '../../../../core/enums/module.enum.js';
import { ok } from '../../../../shared/interceptors/response.interceptor.js';

export class CrmController {
  routes(): RouteDefinition[] {
    return [
      {
        method: 'GET',
        path: '/crm',
        handler: () =>
          ok({
            capabilities: ['lead-capture', 'pipeline', 'lead-scoring', 'event-publishing'],
            module: ModuleName.Crm,
            status: 'active',
          }),
      },
    ];
  }
}
