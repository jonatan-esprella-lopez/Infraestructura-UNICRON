import type { AppServices } from '../../../../core/types/api.types.js';
import type { Property } from '../../domain/entities/property.entity.js';
import type { IPropertyRepository, PropertyFilters } from '../../domain/repositories/property.repository.js';
import { createDomainEvent } from '../../../../events/event-bus.js';
import { PROPERTY_CREATED, type PropertyCreatedPayload } from '../../domain/events/property-created.event.js';
import { PROPERTY_PUBLISHED, type PropertyPublishedPayload } from '../../domain/events/property-published.event.js';

export class PropertyService {
  constructor(
    private readonly repository: IPropertyRepository,
    private readonly services: AppServices,
  ) {}

  async findAll(filters: PropertyFilters): Promise<{ items: Property[]; total: number }> {
    return this.repository.findAll(filters);
  }

  async findById(id: string): Promise<Property | null> {
    return this.repository.findById(id);
  }

  async create(data: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<Property> {
    const property = await this.repository.create(data);
    await this.services.eventBus.publish(
      createDomainEvent<PropertyCreatedPayload>(PROPERTY_CREATED, {
        propertyId: property.id,
        tenantId: property.tenantId,
        ownerId: property.ownerId,
        title: property.title,
        operationType: property.operationType,
        propertyType: property.propertyType,
      }),
    );
    return property;
  }

  async update(id: string, data: Partial<Property>): Promise<Property> {
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    return this.repository.softDelete(id);
  }

  async publish(id: string): Promise<Property> {
    const property = await this.repository.publish(id);
    await this.services.eventBus.publish(
      createDomainEvent<PropertyPublishedPayload>(PROPERTY_PUBLISHED, {
        propertyId: property.id,
        tenantId: property.tenantId,
        title: property.title,
        city: property.city,
        zone: property.zone,
        price: property.price,
        currency: property.currency,
      }),
    );
    return property;
  }

  async unpublish(id: string): Promise<Property> {
    return this.repository.unpublish(id);
  }

  async archive(id: string): Promise<Property> {
    return this.repository.archive(id);
  }
}
