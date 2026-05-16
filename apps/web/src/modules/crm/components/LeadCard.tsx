import { Badge } from '@shared/components/ui/badge';
import { cx } from '@shared/utils/class-name.utils';
import type { Lead } from '../types/lead.types';
import './LeadCard.css';

export function LeadCard({ lead }: { lead: Lead }) {
  return (
    <article className={cx('crm-lead-card', lead.score >= 85 && 'crm-lead-card--hot')}>
      <strong>{lead.name}</strong>
      <span className="crm-lead-card__company">{lead.company}</span>
      <Badge>Score {lead.score}</Badge>
    </article>
  );
}
