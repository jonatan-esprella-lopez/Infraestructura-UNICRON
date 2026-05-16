import type { PropertySale, SaleType, PaymentMethod, SaleLocation } from '../entities/property-sale.entity.js';

export interface SaleFilters {
  tenantId: string;
  agentId?: string;
  saleType?: SaleType;
  paymentMethod?: PaymentMethod;
  saleLocation?: SaleLocation;
  from?: Date;
  to?: Date;
}

export interface IPropertySaleRepository {
  findAll(filters: SaleFilters): Promise<PropertySale[]>;
  findById(id: string): Promise<PropertySale | null>;
  create(data: Omit<PropertySale, 'id' | 'createdAt' | 'updatedAt'>): Promise<PropertySale>;
  update(id: string, data: Partial<PropertySale>): Promise<PropertySale>;
  delete(id: string): Promise<void>;
}
