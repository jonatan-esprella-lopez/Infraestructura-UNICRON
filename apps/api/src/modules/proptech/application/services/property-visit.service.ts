import type { AppServices } from '../../../../core/types/api.types.js';
import type { PropertyVisit } from '../../domain/entities/property-visit.entity.js';
import type { IPropertyVisitRepository } from '../../domain/repositories/property-visit.repository.js';
import { createDomainEvent } from '../../../../events/event-bus.js';
import {
  PROPERTY_VISIT_SCHEDULED,
  type PropertyVisitScheduledPayload,
} from '../../domain/events/property-visit-scheduled.event.js';

export class PropertyVisitService {
  constructor(
    private readonly repository: IPropertyVisitRepository,
    private readonly services: AppServices,
  ) {}

  async findByProperty(propertyId: string): Promise<PropertyVisit[]> {
    return this.repository.findByPropertyId(propertyId);
  }

  async findByClient(clientId: string): Promise<PropertyVisit[]> {
    return this.repository.findByClientId(clientId);
  }

  async schedule(data: Omit<PropertyVisit, 'id' | 'createdAt' | 'updatedAt'>): Promise<PropertyVisit> {
    const visit = await this.repository.create(data);
    await this.services.eventBus.publish(
      createDomainEvent<PropertyVisitScheduledPayload>(PROPERTY_VISIT_SCHEDULED, {
        visitId: visit.id,
        propertyId: visit.propertyId,
        clientId: visit.clientId,
        agentId: visit.agentId,
        scheduledAt: visit.scheduledAt.toISOString(),
        visitType: visit.visitType,
      }),
    );
    return visit;
  }

  async confirm(id: string): Promise<PropertyVisit> {
    return this.repository.update(id, { status: 'confirmed' });
  }

  async cancel(id: string): Promise<PropertyVisit> {
    return this.repository.update(id, { status: 'cancelled' });
  }

  async complete(id: string, result?: string, feedback?: string): Promise<PropertyVisit> {
    return this.repository.update(id, {
      status: 'completed',
      result: result as PropertyVisit['result'],
      agentFeedback: feedback,
    });
  }
}
