import { environment } from '@bootstrap/environment';
import type { MatchingResponse, ClientPreference } from '../types/property-matching.types';

const BASE = `${environment.apiBaseUrl}/v1/proptech/matching`;

export const propertyMatchingService = {
  async getRecommendations(clientId: string): Promise<MatchingResponse> {
    const res = await fetch(`${BASE}/client/${clientId}/recommendations`);
    if (!res.ok) throw new Error('Error al obtener recomendaciones');
    return res.json() as Promise<MatchingResponse>;
  },

  async matchClient(clientId: string, preference: ClientPreference): Promise<MatchingResponse> {
    const res = await fetch(`${BASE}/client/${clientId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preference),
    });
    if (!res.ok) throw new Error('Error al ejecutar matching');
    return res.json() as Promise<MatchingResponse>;
  },
};
