import { environment } from '@bootstrap/environment';
import type { PropertyVisit } from '../types/property-visit.types';

const BASE = `${environment.apiBaseUrl}/v1/proptech`;

export const propertyVisitService = {
  async findByProperty(propertyId: string): Promise<PropertyVisit[]> {
    const res = await fetch(`${BASE}/properties/${propertyId}/visits`);
    if (!res.ok) throw new Error('Error al obtener visitas');
    return res.json() as Promise<PropertyVisit[]>;
  },

  async schedule(propertyId: string, data: Partial<PropertyVisit>): Promise<PropertyVisit> {
    const res = await fetch(`${BASE}/properties/${propertyId}/visits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al agendar visita');
    return res.json() as Promise<PropertyVisit>;
  },

  async confirm(visitId: string): Promise<PropertyVisit> {
    const res = await fetch(`${BASE}/visits/${visitId}/confirm`, { method: 'PATCH' });
    if (!res.ok) throw new Error('Error al confirmar visita');
    return res.json() as Promise<PropertyVisit>;
  },

  async cancel(visitId: string): Promise<PropertyVisit> {
    const res = await fetch(`${BASE}/visits/${visitId}/cancel`, { method: 'PATCH' });
    if (!res.ok) throw new Error('Error al cancelar visita');
    return res.json() as Promise<PropertyVisit>;
  },

  async complete(visitId: string, result?: string, feedback?: string): Promise<PropertyVisit> {
    const res = await fetch(`${BASE}/visits/${visitId}/complete`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ result, agentFeedback: feedback }),
    });
    if (!res.ok) throw new Error('Error al completar visita');
    return res.json() as Promise<PropertyVisit>;
  },
};
