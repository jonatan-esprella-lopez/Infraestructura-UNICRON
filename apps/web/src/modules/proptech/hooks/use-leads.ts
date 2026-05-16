import { useState, useEffect, useCallback } from 'react';
import type { Lead, LeadFilters } from '../types/lead.types';
import { leadService } from '../services/lead.service';

export function useLeads(filters: LeadFilters = {}) {
  const [items, setItems] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await leadService.findAll(filters);
      setItems(data.items);
      setTotal(data.total);
    } catch (err: unknown) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  useEffect(() => { void load(); }, [load]);

  return { leads: items, total, loading, error, reload: load };
}
