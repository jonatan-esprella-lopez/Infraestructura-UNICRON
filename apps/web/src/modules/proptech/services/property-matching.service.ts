import { environment } from '@bootstrap/environment';
import type { MatchingResponse, ClientPreference, PropertyMatch } from '../types/property-matching.types';

const BASE = `${environment.apiBaseUrl}/v1/proptech/matching`;

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('intersim.token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export const propertyMatchingService = {
  async getAll(): Promise<PropertyMatch[]> {
    const res = await fetch(BASE, { headers: authHeaders() });
    if (!res.ok) throw new Error('Error al obtener historial');
    const json = await res.json() as { data: PropertyMatch[] };
    return json.data;
  },

  async getRecommendations(clientId: string): Promise<MatchingResponse> {
    const res = await fetch(`${BASE}/client/${clientId}/recommendations`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Error al obtener recomendaciones');
    const json = await res.json() as { data: MatchingResponse };
    return json.data;
  },

  async matchClient(clientId: string, preference: ClientPreference): Promise<MatchingResponse> {
    const res = await fetch(`${BASE}/client/${clientId}`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(preference),
    });
    if (!res.ok) throw new Error('Error al ejecutar matching');
    const json = await res.json() as { data: MatchingResponse };
    return json.data;
  },
};
