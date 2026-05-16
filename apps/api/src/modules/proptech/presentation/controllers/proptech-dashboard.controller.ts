import type { RouteDefinition, RequestContext, ApiResponse } from '../../../../core/types/api.types.js';
import type { ProptechDashboardService } from '../../application/services/proptech-dashboard.service.js';
import { ok, badRequest } from '../../../../shared/interceptors/response.interceptor.js';

export class ProptechDashboardController {
  constructor(private readonly service: ProptechDashboardService) {}

  routes(): RouteDefinition[] {
    return [
      {
        method: 'GET',
        path: '/proptech/dashboard/me',
        handler: (ctx) => this.getDashboardForMe(ctx),
      },
    ];
  }

  private async getDashboardForMe(ctx: RequestContext): Promise<ApiResponse> {
    if (!ctx.user) return badRequest('Usuario no autenticado');
    const data = await this.service.getDashboardForUser(ctx.user);
    return ok(data);
  }
}
