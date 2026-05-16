export type PurchaseIntention = 'immediate' | 'within_3_months' | 'within_6_months' | 'exploratory';
export type UrgencyLevel = 'high' | 'medium' | 'low';

export interface PropertyClientProfile {
  id: string;
  clientId: string;
  operationType?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  currency?: string;
  preferredCity?: string;
  preferredZones?: string[];
  minBedrooms?: number;
  minBathrooms?: number;
  minArea?: number;
  requiresParking?: boolean;
  purchaseIntention?: PurchaseIntention;
  urgencyLevel?: UrgencyLevel;
  financingRequired?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
