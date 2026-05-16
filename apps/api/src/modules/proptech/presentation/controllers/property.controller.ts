import type { RouteDefinition, RequestContext, ApiResponse } from '../../../../core/types/api.types.js';
import type { PropertyService } from '../../application/services/property.service.js';
import { ok, created, notFound } from '../../../../shared/interceptors/response.interceptor.js';

export class PropertyController {
  constructor(private readonly service: PropertyService) {}

  routes(): RouteDefinition[] {
    return [
      {
        method: 'GET',
        path: '/proptech/properties',
        handler: (ctx) => this.list(ctx),
      },
      {
        method: 'POST',
        path: '/proptech/properties',
        handler: (ctx) => this.create(ctx),
      },
      {
        method: 'GET',
        path: '/proptech/properties/:id',
        handler: (ctx) => this.findOne(ctx),
      },
      {
        method: 'PATCH',
        path: '/proptech/properties/:id',
        handler: (ctx) => this.update(ctx),
      },
      {
        method: 'DELETE',
        path: '/proptech/properties/:id',
        handler: (ctx) => this.remove(ctx),
      },
      {
        method: 'POST',
        path: '/proptech/properties/:id/publish',
        handler: (ctx) => this.publish(ctx),
      },
      {
        method: 'POST',
        path: '/proptech/properties/:id/unpublish',
        handler: (ctx) => this.unpublish(ctx),
      },
      {
        method: 'POST',
        path: '/proptech/properties/:id/archive',
        handler: (ctx) => this.archive(ctx),
      },
    ];
  }

  private async list(ctx: RequestContext): Promise<ApiResponse> {
    const { operationType, propertyType, city, zone, minPrice, maxPrice, minBedrooms, publicationStatus, limit, offset } =
      ctx.query;
    const result = await this.service.findAll({
      tenantId: ctx.tenantId,
      operationType,
      propertyType,
      city,
      zone,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minBedrooms: minBedrooms ? Number(minBedrooms) : undefined,
      publicationStatus,
      limit: limit ? Number(limit) : 20,
      offset: offset ? Number(offset) : 0,
    });
    return ok(result);
  }

  private async create(ctx: RequestContext): Promise<ApiResponse> {
    const body = ctx.body as Record<string, unknown>;
    const property = await this.service.create({
      tenantId: ctx.tenantId ?? body['tenantId'] as string,
      ownerId: body['ownerId'] as string,
      agentId: body['agentId'] as string | undefined,
      title: body['title'] as string,
      description: body['description'] as string ?? '',
      propertyType: body['propertyType'] as string as never,
      operationType: body['operationType'] as string as never,
      status: 'draft',
      publicationStatus: 'unpublished',
      price: Number(body['price']),
      currency: (body['currency'] as string ?? 'USD') as never,
      areaTotal: Number(body['areaTotal']),
      areaBuilt: body['areaBuilt'] ? Number(body['areaBuilt']) : undefined,
      bedrooms: body['bedrooms'] ? Number(body['bedrooms']) : undefined,
      bathrooms: body['bathrooms'] ? Number(body['bathrooms']) : undefined,
      parkingSpaces: body['parkingSpaces'] ? Number(body['parkingSpaces']) : undefined,
      floorNumber: body['floorNumber'] ? Number(body['floorNumber']) : undefined,
      yearBuilt: body['yearBuilt'] ? Number(body['yearBuilt']) : undefined,
      address: body['address'] as string,
      city: body['city'] as string,
      zone: body['zone'] as string | undefined,
      latitude: body['latitude'] ? Number(body['latitude']) : undefined,
      longitude: body['longitude'] ? Number(body['longitude']) : undefined,
      legalStatus: (body['legalStatus'] as string ?? 'unknown') as never,
      isFeatured: Boolean(body['isFeatured']),
    });
    return created(property);
  }

  private async findOne(ctx: RequestContext): Promise<ApiResponse> {
    const property = await this.service.findById(ctx.params['id']);
    if (!property) return notFound('Propiedad no encontrada');
    return ok(property);
  }

  private async update(ctx: RequestContext): Promise<ApiResponse> {
    const property = await this.service.update(ctx.params['id'], ctx.body as Record<string, unknown>);
    return ok(property);
  }

  private async remove(ctx: RequestContext): Promise<ApiResponse> {
    await this.service.delete(ctx.params['id']);
    return ok({ deleted: true });
  }

  private async publish(ctx: RequestContext): Promise<ApiResponse> {
    const property = await this.service.publish(ctx.params['id']);
    return ok(property);
  }

  private async unpublish(ctx: RequestContext): Promise<ApiResponse> {
    const property = await this.service.unpublish(ctx.params['id']);
    return ok(property);
  }

  private async archive(ctx: RequestContext): Promise<ApiResponse> {
    const property = await this.service.archive(ctx.params['id']);
    return ok(property);
  }
}
