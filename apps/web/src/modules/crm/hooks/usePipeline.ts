import { useMemo } from 'react';
import { CRM_STAGES } from '../constants/crm.constants';
import { crmLeads } from '../repositories/crm.repository';

export function usePipeline() {
  return useMemo(
    () =>
      CRM_STAGES.map((stage) => ({
        ...stage,
        leads: crmLeads.filter((lead) => lead.stage === stage.id),
      })),
    [],
  );
}
