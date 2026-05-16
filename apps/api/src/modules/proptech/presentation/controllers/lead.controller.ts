import type { RouteDefinition, RequestContext, ApiResponse, AuthenticatedUser } from '../../../../core/types/api.types.js';
import type { LeadService } from '../../application/services/lead.service.js';
import type { Lead } from '../../domain/entities/lead.entity.js';
import { ok, created, notFound } from '../../../../shared/interceptors/response.interceptor.js';

export class LeadController {
  constructor(private readonly service: LeadService) {}

  routes(): RouteDefinition[] {
    return [
      {
        method: 'GET',
        path: '/proptech/leads',
        handler: (ctx) => this.list(ctx),
      },
      {
        method: 'POST',
        path: '/proptech/leads',
        handler: (ctx) => this.create(ctx),
      },
      {
        method: 'GET',
        path: '/proptech/leads/:id',
        handler: (ctx) => this.getById(ctx),
      },
      {
        method: 'PATCH',
        path: '/proptech/leads/:id',
        handler: (ctx) => this.update(ctx),
      },
      {
        method: 'DELETE',
        path: '/proptech/leads/:id',
        handler: (ctx) => this.delete(ctx),
      },
    ];
  }

  private async list(ctx: RequestContext): Promise<ApiResponse> {
    const user = ctx.user as AuthenticatedUser | null;
    const status = ctx.query?.['status'] as Lead['status'] | undefined;
    const limit = ctx.query?.['limit'] ? Number(ctx.query['limit']) : 50;
    const offset = ctx.query?.['offset'] ? Number(ctx.query['offset']) : 0;
    let agentId = ctx.query?.['agentId'] as string | undefined;

    if (user?.roles?.includes('agent') && !agentId) {
      agentId = user.id;
    }

    const result = await this.service.findAll({ status, agentId, limit, offset });
    return ok(result);
  }

  private async create(ctx: RequestContext): Promise<ApiResponse> {
    const user = ctx.user as AuthenticatedUser | null;
    const body = ctx.body as Record<string, unknown>;

    const lead = await this.service.create({
      tenantId: user?.tenantId ?? '',
      agentId: (body['agentId'] as string | undefined) ?? user?.id,
      firstName: body['firstName'] as string,
      lastName: body['lastName'] as string,
      email: body['email'] as string | undefined,
      phone: body['phone'] as string | undefined,
      source: (body['source'] as Lead['source']) ?? 'manual',
      status: (body['status'] as Lead['status']) ?? 'new',
      operationType: body['operationType'] as string | undefined,
      propertyType: body['propertyType'] as string | undefined,
      budgetMin: body['budgetMin'] as number | undefined,
      budgetMax: body['budgetMax'] as number | undefined,
      currency: (body['currency'] as string) ?? 'BOB',
      preferredCity: body['preferredCity'] as string | undefined,
      notes: body['notes'] as string | undefined,
      convertedAt: body['convertedAt'] ? new Date(body['convertedAt'] as string) : undefined,
    });
    return created(lead);
  }

  private async getById(ctx: RequestContext): Promise<ApiResponse> {
    const lead = await this.service.findById(ctx.params['id']);
    if (!lead) return notFound('Lead no encontrado');
    return ok(lead);
  }

  private async update(ctx: RequestContext): Promise<ApiResponse> {
    const body = ctx.body as Record<string, unknown>;
    const lead = await this.service.update(ctx.params['id'], body as Partial<Lead>);
    return ok(lead);
  }

  private async delete(ctx: RequestContext): Promise<ApiResponse> {
    await this.service.delete(ctx.params['id']);
    return ok({ deleted: true });
  }
}
