import type { Lead } from '../types/lead.types';

export const CRM_STAGES: Array<{ id: Lead['stage']; title: string }> = [
  { id: 'new', title: 'Nuevo' },
  { id: 'qualified', title: 'Calificado' },
  { id: 'proposal', title: 'Propuesta' },
  { id: 'won', title: 'Ganado' },
];

export const CRM_MODULE = {
  key: 'crm',
  title: 'CRM',
  description: 'Base de ventas adaptable para Quantum, VIVA o cualquier reto comercial.',
} as const;
