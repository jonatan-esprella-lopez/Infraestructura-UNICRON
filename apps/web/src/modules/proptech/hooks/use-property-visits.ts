import { useState, useEffect } from 'react';
import type { PropertyVisit } from '../types/property-visit.types';
import { propertyVisitService } from '../services/property-visit.service';

export function usePropertyVisits(propertyId: string) {
  const [visits, setVisits] = useState<PropertyVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = () => {
    setLoading(true);
    propertyVisitService
      .findByProperty(propertyId)
      .then(setVisits)
      .catch((err: unknown) => setError(String(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!propertyId) return;
    reload();
  }, [propertyId]);

  const schedule = async (data: Partial<PropertyVisit>) => {
    const visit = await propertyVisitService.schedule(propertyId, data);
    setVisits((prev) => [...prev, visit]);
    return visit;
  };

  const confirm = async (visitId: string) => {
    const updated = await propertyVisitService.confirm(visitId);
    setVisits((prev) => prev.map((v) => (v.id === visitId ? updated : v)));
  };

  const cancel = async (visitId: string) => {
    const updated = await propertyVisitService.cancel(visitId);
    setVisits((prev) => prev.map((v) => (v.id === visitId ? updated : v)));
  };

  return { visits, loading, error, schedule, confirm, cancel };
}
