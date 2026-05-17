import { environment } from '@bootstrap/environment';
import type { Property, PropertyFilters, PropertyListResponse } from '../types/property.types';

const BASE = `${environment.apiBaseUrl}/v1/proptech/properties`;

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('intersim.token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export const propertyService = {
  /** Uso interno (panel agente/admin) — envía token Bearer para filtrado por rol */
  async findAll(filters: PropertyFilters = {}): Promise<PropertyListResponse> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null) params.set(k, String(v));
    });
    const res = await fetch(`${BASE}?${params}`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Error al obtener propiedades');
    const json = (await res.json()) as { data: PropertyListResponse };
    return json.data;
  },

  /** Uso público (listado abierto) — sin token para evitar filtrado por rol */
  async findAllPublic(filters: PropertyFilters = {}): Promise<PropertyListResponse> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null) params.set(k, String(v));
    });
    const res = await fetch(`${BASE}?${params}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Error al obtener propiedades');
    const json = (await res.json()) as { data: PropertyListResponse };
    return json.data;
  },

  async findById(id: string): Promise<Property> {
    const res = await fetch(`${BASE}/${id}`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Propiedad no encontrada');
    const json = (await res.json()) as { data: Property };
    return json.data;
  },

  async findByIdPublic(id: string): Promise<Property> {
    const res = await fetch(`${BASE}/${id}`, { headers: { 'Content-Type': 'application/json' } });
    if (!res.ok) throw new Error('Propiedad no encontrada');
    const json = (await res.json()) as { data: Property };
    return json.data;
  },

  async create(data: Partial<Property>): Promise<Property> {
    const res = await fetch(BASE, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al crear propiedad');
    const json = (await res.json()) as { data: Property };
    return json.data;
  },

  async update(id: string, data: Partial<Property>): Promise<Property> {
    const res = await fetch(`${BASE}/${id}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al actualizar propiedad');
    const json = (await res.json()) as { data: Property };
    return json.data;
  },

  async publish(id: string): Promise<Property> {
    const res = await fetch(`${BASE}/${id}/publish`, { method: 'POST', headers: authHeaders() });
    if (!res.ok) throw new Error('Error al publicar propiedad');
    const json = (await res.json()) as { data: Property };
    return json.data;
  },

  async unpublish(id: string): Promise<Property> {
    const res = await fetch(`${BASE}/${id}/unpublish`, { method: 'POST', headers: authHeaders() });
    if (!res.ok) throw new Error('Error al despublicar propiedad');
    const json = (await res.json()) as { data: Property };
    return json.data;
  },

  async archive(id: string): Promise<Property> {
    const res = await fetch(`${BASE}/${id}/archive`, { method: 'POST', headers: authHeaders() });
    if (!res.ok) throw new Error('Error al archivar propiedad');
    const json = (await res.json()) as { data: Property };
    return json.data;
  },

  async remove(id: string): Promise<void> {
    await fetch(`${BASE}/${id}`, { method: 'DELETE', headers: authHeaders() });
  },
};
