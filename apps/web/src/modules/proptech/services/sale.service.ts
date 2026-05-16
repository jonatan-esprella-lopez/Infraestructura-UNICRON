import { environment } from '@bootstrap/environment';
import type { PropertySale, CreateSalePayload, SaleFilters } from '../types/sale.types';

const BASE = `${environment.apiBaseUrl}/v1/proptech/sales`;

export const saleService = {
  async findAll(filters: SaleFilters = {}): Promise<PropertySale[]> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null) params.set(k, String(v));
    });
    const res = await fetch(`${BASE}?${params}`);
    if (!res.ok) throw new Error('Error al obtener ventas');
    return res.json() as Promise<PropertySale[]>;
  },

  async findById(id: string): Promise<PropertySale> {
    const res = await fetch(`${BASE}/${id}`);
    if (!res.ok) throw new Error('Venta no encontrada');
    return res.json() as Promise<PropertySale>;
  },

  async create(data: CreateSalePayload): Promise<PropertySale> {
    const res = await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al registrar venta');
    return res.json() as Promise<PropertySale>;
  },

  async update(id: string, data: Partial<CreateSalePayload>): Promise<PropertySale> {
    const res = await fetch(`${BASE}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al actualizar venta');
    return res.json() as Promise<PropertySale>;
  },

  async remove(id: string): Promise<void> {
    await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  },
};
