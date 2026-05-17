import type { Lead } from '../types/lead.types';

export const crmLeads: Lead[] = [
  { id: 'lead-1', name: 'Nadia Rojas', company: 'Quantum', score: 92, stage: 'qualified' },
  { id: 'lead-2', name: 'Marco Lima', company: 'VIVA', score: 81, stage: 'proposal' },
  { id: 'lead-3', name: 'Ana Cuellar', company: 'WASI', score: 74, stage: 'new' },
  { id: 'lead-4', name: 'Diego Paz', company: 'ItDux', score: 88, stage: 'won' },
];

export const crmRepository = {
  async findAll() {
    return crmLeads;
  },
  async findById(id: string) {
    return crmLeads.find((lead) => lead.id === id) ?? null;
  },
};
