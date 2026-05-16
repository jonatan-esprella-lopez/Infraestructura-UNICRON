import { Badge } from '@shared/components/ui/badge';
import '@modules/_shared/module-summary/ModuleSummary.css';
import { DASHBOARD_MODULE } from '../constants/dashboard.constants';

export function DashboardSummary() {
  return (
    <div className="module-summary">
      {DASHBOARD_MODULE.capabilities.map((capability) => (
        <Badge key={capability}>{capability}</Badge>
      ))}
    </div>
  );
}
