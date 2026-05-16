export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'countered' | 'expired' | 'withdrawn';

export interface PropertyOffer {
  id: string;
  propertyId: string;
  clientId: string;
  agentId?: string;
  amount: number;
  currency: string;
  status: OfferStatus;
  message?: string;
  expiresAt?: Date;
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
