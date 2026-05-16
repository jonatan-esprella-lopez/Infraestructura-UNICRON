import { useState, useEffect, useCallback } from 'react';
import { environment } from '@bootstrap/environment';

export type VisitStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled';
export type VisitType = 'in_person' | 'virtual';
export type VisitResult = 'interested' | 'not_interested' | 'pending_decision' | 'offer_made';

export interface Visit {
  id: string;
  propertyId: string;
  clientId: string;
  agentId?: string;
  scheduledAt: string;
  status: VisitStatus;
  visitType: VisitType;
  notes?: string;
  clientFeedback?: string;
  agentFeedback?: string;
  result?: VisitResult;
  createdAt: string;
  updatedAt: string;
}

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('intersim.token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export const visitService = {
  async findAll(): Promise<Visit[]> {
    const res = await fetch(`${environment.apiBaseUrl}/v1/proptech/visits`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Error al obtener visitas');
    const json = (await res.json()) as { data: Visit[] };
    return json.data;
  },

  async confirm(id: string): Promise<Visit> {
    const res = await fetch(`${environment.apiBaseUrl}/v1/proptech/visits/${id}/confirm`, {
      method: 'PATCH',
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Error al confirmar visita');
    const json = (await res.json()) as { data: Visit };
    return json.data;
  },

  async cancel(id: string): Promise<Visit> {
    const res = await fetch(`${environment.apiBaseUrl}/v1/proptech/visits/${id}/cancel`, {
      method: 'PATCH',
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Error al cancelar visita');
    const json = (await res.json()) as { data: Visit };
    return json.data;
  },

  async complete(id: string, result?: string, feedback?: string): Promise<Visit> {
    const res = await fetch(`${environment.apiBaseUrl}/v1/proptech/visits/${id}/complete`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ result, agentFeedback: feedback }),
    });
    if (!res.ok) throw new Error('Error al completar visita');
    const json = (await res.json()) as { data: Visit };
    return json.data;
  },
};

export function useVisits() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await visitService.findAll();
      setVisits(data);
    } catch (err: unknown) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  return { visits, loading, error, reload: load };
}
