import type { RouteDefinition, RequestContext, ApiResponse } from '../../../../core/types/api.types.js';
import type { PropertyMatchingService } from '../../application/services/property-matching.service.js';
import type { PropertyClientProfile } from '../../domain/entities/property-client-profile.entity.js';
import { ok } from '../../../../shared/interceptors/response.interceptor.js';

export class PropertyMatchingController {
  constructor(private readonly service: PropertyMatchingService) {}

  routes(): RouteDefinition[] {
    return [
      {
        method: 'GET',
        path: '/proptech/matching/client/:clientId/recommendations',
        handler: (ctx) => this.getRecommendations(ctx),
      },
      {
        method: 'POST',
        path: '/proptech/matching/client/:clientId',
        handler: (ctx) => this.matchClient(ctx),
      },
    ];
  }

  private async getRecommendations(ctx: RequestContext): Promise<ApiResponse> {
    const matches = await this.service.getRecommendations(ctx.params['clientId']);
    return ok(matches);
  }

  private async matchClient(ctx: RequestContext): Promise<ApiResponse> {
    const profile = ctx.body as PropertyClientProfile;
    const matches = await this.service.matchClient(ctx.params['clientId'], profile);
    return ok({ clientId: ctx.params['clientId'], totalMatches: matches.length, matches });
  }
}
