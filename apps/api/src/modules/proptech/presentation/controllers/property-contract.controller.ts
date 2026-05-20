import type { RouteDefinition, RequestContext, ApiResponse } from '../../../../core/types/api.types.js';
import type { PropertyContractService } from '../../application/services/property-contract.service.js';
import { ok, created, notFound, badRequest } from '../../../../shared/interceptors/response.interceptor.js';

export class PropertyContractController {
  constructor(private readonly service: PropertyContractService) {}

  routes(): RouteDefinition[] {
    return [
      {
        method: 'GET',
        path: '/proptech/properties/:id/contracts',
        handler: (ctx) => this.listByProperty(ctx),
      },
      {
        method: 'POST',
        path: '/proptech/contracts',
        handler: (ctx) => this.create(ctx),
      },
      {
        method: 'POST',
        path: '/proptech/contracts/review-ai',
        handler: (ctx) => this.reviewTextWithAi(ctx),
      },
      {
        method: 'GET',
        path: '/proptech/contracts/:id',
        handler: (ctx) => this.findOne(ctx),
      },
      {
        method: 'POST',
        path: '/proptech/contracts/:id/review-ai',
        handler: (ctx) => this.reviewWithAi(ctx),
      },
    ];
  }

  private async listByProperty(ctx: RequestContext): Promise<ApiResponse> {
    const contracts = await this.service.findByProperty(ctx.params['id']);
    return ok(contracts);
  }

  private async create(ctx: RequestContext): Promise<ApiResponse> {
    const body = ctx.body as Record<string, unknown>;
    const contract = await this.service.create({
      propertyId: body['propertyId'] as string,
      clientId: body['clientId'] as string,
      ownerId: body['ownerId'] as string,
      agentId: body['agentId'] as string | undefined,
      contractType: body['contractType'] as never,
      status: 'draft',
      fileUrl: body['fileUrl'] as string | undefined,
      draftText: body['draftText'] as string | undefined,
      totalAmount: Number(body['totalAmount']),
      currency: body['currency'] as string ?? 'USD',
      startDate: body['startDate'] ? new Date(body['startDate'] as string) : undefined,
      endDate: body['endDate'] ? new Date(body['endDate'] as string) : undefined,
    });
    return created(contract);
  }

  private async findOne(ctx: RequestContext): Promise<ApiResponse> {
    const contract = await this.service.findById(ctx.params['id']);
    if (!contract) return notFound('Contrato no encontrado');
    return ok(contract);
  }

  private async reviewWithAi(ctx: RequestContext): Promise<ApiResponse> {
    const review = await this.service.reviewWithAi(ctx.params['id']);
    return ok(review);
  }

  private async reviewTextWithAi(ctx: RequestContext): Promise<ApiResponse> {
    const body = ctx.body as Record<string, unknown> | undefined;
    const draftText = typeof body?.['draftText'] === 'string' ? body['draftText'].trim() : '';

    if (!draftText) {
      return badRequest('El texto del contrato es obligatorio');
    }

    const review = await this.service.reviewTextWithAi(draftText);
    return ok(review);
  }
}
