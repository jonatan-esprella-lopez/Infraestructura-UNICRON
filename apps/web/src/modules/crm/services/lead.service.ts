import type { Lead } from '../types/lead.types';

export const leadService = {
  getLeadScoreLabel(lead: Lead) {
    if (lead.score >= 85) return 'Alta prioridad';
    if (lead.score >= 70) return 'Prioridad media';
    return 'Nutrir';
  },
};
