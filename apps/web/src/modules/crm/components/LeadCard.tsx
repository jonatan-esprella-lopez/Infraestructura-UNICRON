import { Badge } from '@shared/components/ui/badge';
import type { Lead } from '../types/lead.types';

export function LeadCard({ lead }: { lead: Lead }) {
  return (
    <article className="lead-card">
      <strong>{lead.name}</strong>
      <span>{lead.company}</span>
      <Badge>Score {lead.score}</Badge>
    </article>
  );
}
