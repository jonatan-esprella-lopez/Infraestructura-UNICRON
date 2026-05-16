import type { PropertyVisit } from '../entities/property-visit.entity.js';

export interface IPropertyVisitRepository {
  findByPropertyId(propertyId: string): Promise<PropertyVisit[]>;
  findByClientId(clientId: string): Promise<PropertyVisit[]>;
  findById(id: string): Promise<PropertyVisit | null>;
  create(data: Omit<PropertyVisit, 'id' | 'createdAt' | 'updatedAt'>): Promise<PropertyVisit>;
  update(id: string, data: Partial<PropertyVisit>): Promise<PropertyVisit>;
  findByAgentId(agentId: string): Promise<PropertyVisit[]>;
  findAll(): Promise<PropertyVisit[]>;
}
