import type { Lead } from './lead.types';

export interface PipelineColumn {
  id: Lead['stage'];
  title: string;
  leads: Lead[];
}
