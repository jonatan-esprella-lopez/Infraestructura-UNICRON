import { environment } from '@bootstrap/environment';
import type { Lead, LeadFilters, CreateLeadPayload } from '../types/lead.types';

const BASE = `${environment.apiBaseUrl}/v1/proptech/leads`;

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('intersim.token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export const leadService = {
  async findAll(filters: LeadFilters = {}): Promise<{ items: Lead[]; total: number }> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null) params.set(k, String(v));
    });
    const res = await fetch(`${BASE}?${params}`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Error al obtener leads');
    const json = (await res.json()) as { data: { items: Lead[]; total: number } };
    return json.data;
  },

  async findById(id: string): Promise<Lead> {
    const res = await fetch(`${BASE}/${id}`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Lead no encontrado');
    const json = (await res.json()) as { data: Lead };
    return json.data;
  },

  async create(data: CreateLeadPayload): Promise<Lead> {
    const res = await fetch(BASE, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al crear lead');
    const json = (await res.json()) as { data: Lead };
    return json.data;
  },

  async update(id: string, data: Partial<Lead>): Promise<Lead> {
    const res = await fetch(`${BASE}/${id}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al actualizar lead');
    const json = (await res.json()) as { data: Lead };
    return json.data;
  },

  async delete(id: string): Promise<void> {
    await fetch(`${BASE}/${id}`, { method: 'DELETE', headers: authHeaders() });
  },
};
