import type { RouteDefinition, RequestContext, ApiResponse, AuthenticatedUser } from '../../../../core/types/api.types.js';
import type { PropertyVisitService } from '../../application/services/property-visit.service.js';
import { ok, created, notFound } from '../../../../shared/interceptors/response.interceptor.js';

export class PropertyVisitController {
  constructor(private readonly service: PropertyVisitService) {}

  routes(): RouteDefinition[] {
    return [
      {
        method: 'GET',
        path: '/proptech/properties/:id/visits',
        handler: (ctx) => this.listByProperty(ctx),
      },
      {
        method: 'POST',
        path: '/proptech/properties/:id/visits',
        handler: (ctx) => this.schedule(ctx),
      },
      {
        method: 'GET',
        path: '/proptech/visits',
        handler: (ctx) => this.listAll(ctx),
      },
      {
        method: 'PATCH',
        path: '/proptech/visits/:visitId/confirm',
        handler: (ctx) => this.confirm(ctx),
      },
      {
        method: 'PATCH',
        path: '/proptech/visits/:visitId/cancel',
        handler: (ctx) => this.cancel(ctx),
      },
      {
        method: 'PATCH',
        path: '/proptech/visits/:visitId/complete',
        handler: (ctx) => this.complete(ctx),
      },
    ];
  }

  private async listAll(ctx: RequestContext): Promise<ApiResponse> {
    const user = ctx.user as AuthenticatedUser | null;
    const agentId = ctx.query?.['agentId'] as string | undefined;

    if (user?.roles?.includes('agent') && !agentId) {
      const visits = await this.service.findByAgent(user.id);
      return ok(visits);
    }
    if (agentId) {
      const visits = await this.service.findByAgent(agentId);
      return ok(visits);
    }
    const visits = await this.service.findAll();
    return ok(visits);
  }

  private async listByProperty(ctx: RequestContext): Promise<ApiResponse> {
    const visits = await this.service.findByProperty(ctx.params['id']);
    return ok(visits);
  }

  private async schedule(ctx: RequestContext): Promise<ApiResponse> {
    const body = ctx.body as Record<string, unknown>;
    const visit = await this.service.schedule({
      propertyId: ctx.params['id'],
      clientId: body['clientId'] as string,
      agentId: body['agentId'] as string | undefined,
      scheduledAt: new Date(body['scheduledAt'] as string),
      status: 'scheduled',
      visitType: (body['visitType'] as string ?? 'in_person') as never,
      notes: body['notes'] as string | undefined,
    } as never);
    return created(visit);
  }

  private async confirm(ctx: RequestContext): Promise<ApiResponse> {
    const visit = await this.service.confirm(ctx.params['visitId']);
    if (!visit) return notFound('Visita no encontrada');
    return ok(visit);
  }

  private async cancel(ctx: RequestContext): Promise<ApiResponse> {
    const visit = await this.service.cancel(ctx.params['visitId']);
    return ok(visit);
  }

  private async complete(ctx: RequestContext): Promise<ApiResponse> {
    const body = ctx.body as Record<string, unknown>;
    const visit = await this.service.complete(
      ctx.params['visitId'],
      body['result'] as string | undefined,
      body['agentFeedback'] as string | undefined,
    );
    return ok(visit);
  }
}
