import type { PropertySale } from '../../domain/entities/property-sale.entity.js';
import type { IPropertySaleRepository, SaleFilters } from '../../domain/repositories/property-sale.repository.js';
import { randomUUID } from 'node:crypto';

export class InMemoryPropertySaleRepository implements IPropertySaleRepository {
  private store: Map<string, PropertySale> = new Map();

  async findAll(filters: SaleFilters): Promise<PropertySale[]> {
    return Array.from(this.store.values()).filter((s) => {
      if (s.tenantId !== filters.tenantId) return false;
      if (filters.agentId && s.agentId !== filters.agentId) return false;
      if (filters.saleType && s.saleType !== filters.saleType) return false;
      if (filters.paymentMethod && s.paymentMethod !== filters.paymentMethod) return false;
      if (filters.saleLocation && s.saleLocation !== filters.saleLocation) return false;
      if (filters.from && s.soldAt < filters.from) return false;
      if (filters.to && s.soldAt > filters.to) return false;
      return true;
    });
  }

  async findById(id: string): Promise<PropertySale | null> {
    return this.store.get(id) ?? null;
  }

  async create(data: Omit<PropertySale, 'id' | 'createdAt' | 'updatedAt'>): Promise<PropertySale> {
    const now = new Date();
    const sale: PropertySale = { ...data, id: randomUUID(), createdAt: now, updatedAt: now };
    this.store.set(sale.id, sale);
    return sale;
  }

  async update(id: string, data: Partial<PropertySale>): Promise<PropertySale> {
    const existing = this.store.get(id);
    if (!existing) throw new Error(`Sale ${id} not found`);
    const updated = { ...existing, ...data, updatedAt: new Date() };
    this.store.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }
}
