import { useState, useEffect } from 'react';
import { environment } from '@bootstrap/environment';

export interface AdminDashboard {
  totalProperties: number;
  publishedProperties: number;
  pendingProperties: number;
  totalLeads: number;
  totalVisits: number;
  scheduledVisits: number;
  totalOffers: number;
  contractsInReview: number;
  documentsPending: number;
  activeAgents: number;
  conversionRate: number;
}

export interface AgentDashboard {
  assignedProperties: number;
  newLeads: number;
  todayVisits: number;
  pendingTasks: number;
  hotClients: number;
  activeOffers: number;
  contractsPending: number;
  followUpsToday: number;
}

export interface OwnerDashboard {
  ownedProperties: number;
  publishedProperties: number;
  propertyViews: number;
  interestedClients: number;
  scheduledVisits: number;
  receivedOffers: number;
  documentsPending: number;
}

export interface ClientDashboard {
  recommendedProperties: number;
  favoriteProperties: number;
  scheduledVisits: number;
  activeOffers: number;
  contractsPending: number;
  newMatches: number;
}

export type ProptechDashboardData = AdminDashboard | AgentDashboard | OwnerDashboard | ClientDashboard;

export function useProptechDashboard() {
  const [data, setData] = useState<ProptechDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const base = `${environment.apiBaseUrl}/v1/proptech/dashboard/me`;
    fetch(base)
      .then((res) => (res.ok ? res.json() : Promise.reject('Error al cargar dashboard')))
      .then((json: ProptechDashboardData) => setData(json))
      .catch((err: unknown) => setError(String(err)))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
