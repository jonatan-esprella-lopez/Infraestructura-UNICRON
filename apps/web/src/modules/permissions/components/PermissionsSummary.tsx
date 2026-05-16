import { Badge } from '@shared/components/ui/badge';
import '@modules/_shared/module-summary/ModuleSummary.css';
import { PERMISSIONS_MODULE } from '../constants/permissions.constants';

export function PermissionsSummary() {
  return (
    <div className="module-summary">
      {PERMISSIONS_MODULE.capabilities.map((capability) => (
        <Badge key={capability}>{capability}</Badge>
      ))}
    </div>
  );
}
