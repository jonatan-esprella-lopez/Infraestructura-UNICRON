import type { RouteDefinition, RequestContext, ApiResponse, AuthenticatedUser } from '../../../../core/types/api.types.js';
import type { LeadService } from '../../application/services/lead.service.js';
import type { IPropertyRepository } from '../../domain/repositories/property.repository.js';
import type { Lead } from '../../domain/entities/lead.entity.js';
import { ok, created, notFound, badRequest } from '../../../../shared/interceptors/response.interceptor.js';

export class LeadController {
  constructor(
    private readonly service: LeadService,
    private readonly propertyRepo?: IPropertyRepository,
  ) {}

  routes(): RouteDefinition[] {
    return [
      /* ── Public: visitor contact form (no auth required) ── */
      {
        method: 'POST',
        path: '/proptech/leads/public',
        public: true,
        handler: (ctx) => this.createPublic(ctx),
      },
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

  /* Visitor fills contact form on property detail page (no login needed) */
  private async createPublic(ctx: RequestContext): Promise<ApiResponse> {
    const body = ctx.body as Record<string, unknown>;
    const firstName = (body['firstName'] as string | undefined)?.trim();
    const lastName  = (body['lastName']  as string | undefined)?.trim();
    if (!firstName || !lastName) return badRequest('Nombre y apellido son requeridos');

    const propertyId = body['propertyId'] as string | undefined;
    let agentId      = body['agentId']   as string | undefined;
    let propertyTitle = body['propertyTitle'] as string | undefined;

    // Look up property to fill agentId + title if not supplied
    if (propertyId && this.propertyRepo) {
      const prop = await this.propertyRepo.findById(propertyId);
      if (prop) {
        agentId       = agentId       ?? prop.agentId;
        propertyTitle = propertyTitle ?? prop.title;
      }
    }

    const lead = await this.service.create({
      tenantId: 'tenant_intersim',
      agentId,
      propertyId,
      propertyTitle,
      firstName,
      lastName,
      email:    (body['email']   as string | undefined) || undefined,
      phone:    (body['phone']   as string | undefined) || undefined,
      source:   'website',
      status:   'new',
      operationType: body['operationType'] as string | undefined,
      propertyType:  body['propertyType']  as string | undefined,
      currency: 'USD',
      preferredCity: body['preferredCity'] as string | undefined,
      notes: body['message'] as string | undefined,
      budgetMin: undefined,
      budgetMax: undefined,
    });

    return created({ id: lead.id, message: 'Solicitud recibida. El asesor te contactará pronto.' });
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
