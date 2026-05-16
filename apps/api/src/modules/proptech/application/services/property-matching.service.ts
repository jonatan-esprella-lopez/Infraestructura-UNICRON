import type { AppServices } from '../../../../core/types/api.types.js';
import type { PropertyMatch, MatchScoreBreakdown } from '../../domain/entities/property-match.entity.js';
import type { IPropertyMatchingRepository } from '../../domain/repositories/property-matching.repository.js';
import type { IPropertyRepository } from '../../domain/repositories/property.repository.js';
import type { PropertyClientProfile } from '../../domain/entities/property-client-profile.entity.js';
import { createDomainEvent } from '../../../../events/event-bus.js';
import {
  PROPERTY_MATCH_CREATED,
  type PropertyMatchCreatedPayload,
} from '../../domain/events/property-match-created.event.js';

export class PropertyMatchingService {
  constructor(
    private readonly matchingRepository: IPropertyMatchingRepository,
    private readonly propertyRepository: IPropertyRepository,
    private readonly services: AppServices,
  ) {}

  async getAll(): Promise<PropertyMatch[]> {
    return this.matchingRepository.findAll();
  }

  async getRecommendations(clientId: string): Promise<PropertyMatch[]> {
    return this.matchingRepository.findByClientId(clientId);
  }

  async matchClient(clientId: string, profile: PropertyClientProfile): Promise<PropertyMatch[]> {
    const { items: properties } = await this.propertyRepository.findAll({
      publicationStatus: 'published',
      operationType: profile.operationType,
      city: profile.preferredCity,
      minPrice: profile.minPrice,
      maxPrice: profile.maxPrice,
      minBedrooms: profile.minBedrooms,
    });

    const matches: PropertyMatch[] = [];

    for (const property of properties) {
      const breakdown = this.calculateBreakdown(property, profile);
      const score = Object.values(breakdown).reduce((a, b) => a + b, 0);

      const match = await this.matchingRepository.upsert({
        clientId,
        propertyId: property.id,
        score,
        scoreBreakdown: breakdown,
        matchReason: `Score ${score}/100 basado en presupuesto, ubicación y características`,
        riskFlags: property.legalStatus !== 'clear' ? ['legal_status_risk'] : [],
        updatedAt: new Date(),
      } as Omit<PropertyMatch, 'id' | 'createdAt' | 'updatedAt'>);

      await this.services.eventBus.publish(
        createDomainEvent<PropertyMatchCreatedPayload>(PROPERTY_MATCH_CREATED, {
          matchId: match.id,
          clientId,
          propertyId: property.id,
          score,
        }),
      );

      matches.push(match);
    }

    return matches.sort((a, b) => b.score - a.score);
  }

  private calculateBreakdown(property: ReturnType<typeof Object.assign>, profile: PropertyClientProfile): MatchScoreBreakdown {
    return {
      budget: this.scoreBudget(property.price, profile.minPrice, profile.maxPrice),
      location: this.scoreLocation(property.city, property.zone, profile.preferredCity, profile.preferredZones),
      propertyType: property.propertyType === profile.propertyType ? 15 : 0,
      bedrooms: (property.bedrooms ?? 0) >= (profile.minBedrooms ?? 0) ? 10 : 5,
      urgency: profile.urgencyLevel === 'high' ? 10 : profile.urgencyLevel === 'medium' ? 7 : 4,
      legalStatus: property.legalStatus === 'clear' ? 10 : property.legalStatus === 'in_process' ? 5 : 0,
    };
  }

  private scoreBudget(price: number, min?: number, max?: number): number {
    if (!min && !max) return 20;
    if (max && price > max) return 0;
    if (min && price < min) return 10;
    return 30;
  }

  private scoreLocation(city: string, zone: string | undefined, preferredCity?: string, preferredZones?: string[]): number {
    if (!preferredCity) return 15;
    if (city !== preferredCity) return 0;
    if (preferredZones?.length && zone && preferredZones.includes(zone)) return 25;
    return 15;
  }
}
