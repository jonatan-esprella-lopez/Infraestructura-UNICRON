import type { RouteDefinition, RequestContext, ApiResponse } from '../../../../core/types/api.types.js';
import type { ReportService } from '../../application/services/report.service.js';
import { ok, badRequest } from '../../../../shared/interceptors/response.interceptor.js';

export class ReportController {
  constructor(private readonly service: ReportService) {}

  routes(): RouteDefinition[] {
    return [
      { method: 'GET', path: '/proptech/reports/sales-total', handler: (ctx) => this.salesTotal(ctx) },
      { method: 'GET', path: '/proptech/reports/by-payment-method', handler: (ctx) => this.byPaymentMethod(ctx) },
      { method: 'GET', path: '/proptech/reports/by-location', handler: (ctx) => this.byLocation(ctx) },
      { method: 'GET', path: '/proptech/reports/by-agent', handler: (ctx) => this.byAgent(ctx) },
      { method: 'GET', path: '/proptech/reports/by-period', handler: (ctx) => this.byPeriod(ctx) },
    ];
  }

  private buildFilters(ctx: RequestContext) {
    if (!ctx.user?.tenantId) return null;
    const q = ctx.query as Record<string, string>;
    return {
      tenantId: ctx.user.tenantId,
      from: q['from'] ? new Date(q['from']) : undefined,
      to: q['to'] ? new Date(q['to']) : undefined,
      currency: q['currency'],
    };
  }

  private async salesTotal(ctx: RequestContext): Promise<ApiResponse> {
    const filters = this.buildFilters(ctx);
    if (!filters) return badRequest('Usuario no autenticado');
    return ok(await this.service.salesTotal(filters));
  }

  private async byPaymentMethod(ctx: RequestContext): Promise<ApiResponse> {
    const filters = this.buildFilters(ctx);
    if (!filters) return badRequest('Usuario no autenticado');
    return ok(await this.service.byPaymentMethod(filters));
  }

  private async byLocation(ctx: RequestContext): Promise<ApiResponse> {
    const filters = this.buildFilters(ctx);
    if (!filters) return badRequest('Usuario no autenticado');
    return ok(await this.service.byLocation(filters));
  }

  private async byAgent(ctx: RequestContext): Promise<ApiResponse> {
    const filters = this.buildFilters(ctx);
    if (!filters) return badRequest('Usuario no autenticado');
    return ok(await this.service.byAgent(filters));
  }

  private async byPeriod(ctx: RequestContext): Promise<ApiResponse> {
    const filters = this.buildFilters(ctx);
    if (!filters) return badRequest('Usuario no autenticado');
    const q = ctx.query as Record<string, string>;
    const granularity = (q['granularity'] as 'day' | 'month' | 'year') ?? 'month';
    return ok(await this.service.byPeriod(filters, granularity));
  }
}
