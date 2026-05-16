import { useMemo } from 'react';
import { crmLeads } from '../repositories/crm.repository';

export function useLeads() {
  return useMemo(() => ({ leads: crmLeads, total: crmLeads.length }), []);
}
