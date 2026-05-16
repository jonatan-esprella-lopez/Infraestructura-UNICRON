import { Badge } from '@shared/components/ui/badge';
import '@modules/_shared/module-summary/ModuleSummary.css';
import { ANALYTICS_MODULE } from '../constants/analytics.constants';

export function AnalyticsSummary() {
  return (
    <div className="module-summary">
      {ANALYTICS_MODULE.capabilities.map((capability) => (
        <Badge key={capability}>{capability}</Badge>
      ))}
    </div>
  );
}
