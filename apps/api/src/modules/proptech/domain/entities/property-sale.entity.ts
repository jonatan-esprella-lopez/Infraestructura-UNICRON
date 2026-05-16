export type SaleType =
  | 'property_sale'
  | 'rental_closed'
  | 'anticretico_closed'
  | 'reservation'
  | 'agent_commission'
  | 'featured_listing'
  | 'document_review'
  | 'legal_advisory'
  | 'membership';

export type PaymentMethod = 'cash' | 'qr' | 'bank_transfer' | 'deposit' | 'card' | 'other';

export type SaleLocation =
  | 'office'
  | 'property_fair'
  | 'property_visit'
  | 'online'
  | 'whatsapp'
  | 'external';

export type SaleChannel = 'in_person' | 'online' | 'phone' | 'whatsapp' | 'referral';

export interface PropertySale {
  id: string;
  tenantId: string;
  agentId?: string;
  clientId?: string;
  propertyId?: string;
  saleType: SaleType;
  productOrService: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  saleLocation: SaleLocation;
  saleChannel: SaleChannel;
  notes?: string;
  soldAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
