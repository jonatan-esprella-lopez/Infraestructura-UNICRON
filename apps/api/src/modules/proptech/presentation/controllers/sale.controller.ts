import type { RouteDefinition, RequestContext, ApiResponse } from '../../../../core/types/api.types.js';
import type { SaleService } from '../../application/services/sale.service.js';
import { ok, created, notFound, badRequest } from '../../../../shared/interceptors/response.interceptor.js';

export class SaleController {
  constructor(private readonly service: SaleService) {}

  routes(): RouteDefinition[] {
    return [
      { method: 'POST', path: '/proptech/sales', handler: (ctx) => this.create(ctx) },
      { method: 'GET', path: '/proptech/sales', handler: (ctx) => this.list(ctx) },
      { method: 'GET', path: '/proptech/sales/:id', handler: (ctx) => this.findOne(ctx) },
      { method: 'PATCH', path: '/proptech/sales/:id', handler: (ctx) => this.update(ctx) },
      { method: 'DELETE', path: '/proptech/sales/:id', handler: (ctx) => this.remove(ctx) },
    ];
  }

  private async create(ctx: RequestContext): Promise<ApiResponse> {
    if (!ctx.user?.tenantId) return badRequest('Usuario no autenticado');
    const body = ctx.body as Record<string, unknown>;
    const sale = await this.service.create({
      tenantId: ctx.user.tenantId,
      agentId: (body['agentId'] as string | undefined) ?? ctx.user.id,
      clientId: body['clientId'] as string | undefined,
      propertyId: body['propertyId'] as string | undefined,
      saleType: body['saleType'] as never,
      productOrService: body['productOrService'] as string,
      amount: Number(body['amount']),
      currency: (body['currency'] as string) ?? 'BOB',
      paymentMethod: body['paymentMethod'] as never,
      saleLocation: body['saleLocation'] as never,
      saleChannel: body['saleChannel'] as never,
      notes: body['notes'] as string | undefined,
      soldAt: body['soldAt'] ? new Date(body['soldAt'] as string) : undefined,
    });
    return created(sale);
  }

  private async list(ctx: RequestContext): Promise<ApiResponse> {
    if (!ctx.user?.tenantId) return badRequest('Usuario no autenticado');
    const q = ctx.query as Record<string, string>;
    const isAgent = ctx.user.roles.includes('agent');
    const sales = await this.service.list({
      tenantId: ctx.user.tenantId,
      agentId: isAgent ? ctx.user.id : (q['agentId'] ?? undefined),
      saleType: q['saleType'] as never,
      paymentMethod: q['paymentMethod'] as never,
      saleLocation: q['saleLocation'] as never,
      from: q['from'] ? new Date(q['from']) : undefined,
      to: q['to'] ? new Date(q['to']) : undefined,
    });
    return ok(sales);
  }

  private async findOne(ctx: RequestContext): Promise<ApiResponse> {
    const sale = await this.service.findById(ctx.params['id']);
    if (!sale) return notFound('Venta no encontrada');
    return ok(sale);
  }

  private async update(ctx: RequestContext): Promise<ApiResponse> {
    const body = ctx.body as Record<string, unknown>;
    const sale = await this.service.update(ctx.params['id'], body as never);
    return ok(sale);
  }

  private async remove(ctx: RequestContext): Promise<ApiResponse> {
    await this.service.delete(ctx.params['id']);
    return ok({ deleted: true });
  }
}
