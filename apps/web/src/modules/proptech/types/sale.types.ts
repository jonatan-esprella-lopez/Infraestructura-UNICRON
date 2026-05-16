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
export type SaleLocation = 'office' | 'property_fair' | 'property_visit' | 'online' | 'whatsapp' | 'external';
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
  soldAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSalePayload {
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
  soldAt?: string;
}

export interface SaleFilters {
  agentId?: string;
  saleType?: SaleType;
  paymentMethod?: PaymentMethod;
  saleLocation?: SaleLocation;
  from?: string;
  to?: string;
}

export interface SalesTotalReport {
  total: number;
  count: number;
  average: number;
  currency: string;
}

export interface ByPaymentMethodReport {
  method: PaymentMethod;
  total: number;
  count: number;
  percentage: number;
}

export interface ByLocationReport {
  location: SaleLocation;
  total: number;
  count: number;
  percentage: number;
}

export interface ByAgentReport {
  agentId: string;
  total: number;
  count: number;
  average: number;
}

export interface ByPeriodReport {
  period: string;
  total: number;
  count: number;
}

export const SALE_TYPE_LABELS: Record<SaleType, string> = {
  property_sale: 'Venta de propiedad',
  rental_closed: 'Alquiler cerrado',
  anticretico_closed: 'Anticrético cerrado',
  reservation: 'Reserva',
  agent_commission: 'Comisión de agente',
  featured_listing: 'Publicación destacada',
  document_review: 'Revisión de documentos',
  legal_advisory: 'Asesoría legal',
  membership: 'Membresía',
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: 'Efectivo',
  qr: 'QR',
  bank_transfer: 'Transferencia bancaria',
  deposit: 'Depósito',
  card: 'Tarjeta',
  other: 'Otro',
};

export const SALE_LOCATION_LABELS: Record<SaleLocation, string> = {
  office: 'Oficina',
  property_fair: 'Feria inmobiliaria',
  property_visit: 'Visita a propiedad',
  online: 'Online',
  whatsapp: 'WhatsApp',
  external: 'Externo',
};

export const SALE_CHANNEL_LABELS: Record<SaleChannel, string> = {
  in_person: 'Presencial',
  online: 'Online',
  phone: 'Teléfono',
  whatsapp: 'WhatsApp',
  referral: 'Referido',
};
