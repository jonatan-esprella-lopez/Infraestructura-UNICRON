import { apiFetch } from '@shared/utils/api-fetch';
import type { PropertySale, CreateSalePayload, SaleFilters } from '../types/sale.types';

interface SaleApiResponse<T> { data: T }

export const saleService = {
  async findAll(filters: SaleFilters = {}): Promise<PropertySale[]> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null) params.set(k, String(v));
    });
    const res = await apiFetch(`/proptech/sales?${params.toString()}`);
    if (!res.ok) throw new Error('Error al obtener ventas');
    const json = (await res.json()) as SaleApiResponse<PropertySale[]>;
    return json.data;
  },

  async findById(id: string): Promise<PropertySale> {
    const res = await apiFetch(`/proptech/sales/${id}`);
    if (!res.ok) throw new Error('Venta no encontrada');
    const json = (await res.json()) as SaleApiResponse<PropertySale>;
    return json.data;
  },

  async create(data: CreateSalePayload): Promise<PropertySale> {
    const res = await apiFetch('/proptech/sales', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al registrar venta');
    const json = (await res.json()) as SaleApiResponse<PropertySale>;
    return json.data;
  },

  async update(id: string, data: Partial<CreateSalePayload>): Promise<PropertySale> {
    const res = await apiFetch(`/proptech/sales/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al actualizar venta');
    const json = (await res.json()) as SaleApiResponse<PropertySale>;
    return json.data;
  },

  async remove(id: string): Promise<void> {
    await apiFetch(`/proptech/sales/${id}`, { method: 'DELETE' });
  },
};
