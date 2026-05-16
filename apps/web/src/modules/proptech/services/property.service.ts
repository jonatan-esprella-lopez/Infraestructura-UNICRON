import { environment } from '@bootstrap/environment';
import type { Property, PropertyFilters, PropertyListResponse } from '../types/property.types';

const BASE = `${environment.apiBaseUrl}/v1/proptech/properties`;

export const propertyService = {
  async findAll(filters: PropertyFilters = {}): Promise<PropertyListResponse> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null) params.set(k, String(v));
    });
    const res = await fetch(`${BASE}?${params}`);
    if (!res.ok) throw new Error('Error al obtener propiedades');
    return res.json() as Promise<PropertyListResponse>;
  },

  async findById(id: string): Promise<Property> {
    const res = await fetch(`${BASE}/${id}`);
    if (!res.ok) throw new Error('Propiedad no encontrada');
    return res.json() as Promise<Property>;
  },

  async create(data: Partial<Property>): Promise<Property> {
    const res = await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al crear propiedad');
    return res.json() as Promise<Property>;
  },

  async update(id: string, data: Partial<Property>): Promise<Property> {
    const res = await fetch(`${BASE}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al actualizar propiedad');
    return res.json() as Promise<Property>;
  },

  async publish(id: string): Promise<Property> {
    const res = await fetch(`${BASE}/${id}/publish`, { method: 'POST' });
    if (!res.ok) throw new Error('Error al publicar propiedad');
    return res.json() as Promise<Property>;
  },

  async unpublish(id: string): Promise<Property> {
    const res = await fetch(`${BASE}/${id}/unpublish`, { method: 'POST' });
    if (!res.ok) throw new Error('Error al despublicar propiedad');
    return res.json() as Promise<Property>;
  },

  async archive(id: string): Promise<Property> {
    const res = await fetch(`${BASE}/${id}/archive`, { method: 'POST' });
    if (!res.ok) throw new Error('Error al archivar propiedad');
    return res.json() as Promise<Property>;
  },

  async remove(id: string): Promise<void> {
    await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  },
};
