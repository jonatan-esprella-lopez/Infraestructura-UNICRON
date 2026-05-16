import { Badge } from '@shared/components/ui/badge';
import '@modules/_shared/module-summary/ModuleSummary.css';
import { NOTIFICATIONS_MODULE } from '../constants/notifications.constants';

export function NotificationsSummary() {
  return (
    <div className="module-summary">
      {NOTIFICATIONS_MODULE.capabilities.map((capability) => (
        <Badge key={capability}>{capability}</Badge>
      ))}
    </div>
  );
}
