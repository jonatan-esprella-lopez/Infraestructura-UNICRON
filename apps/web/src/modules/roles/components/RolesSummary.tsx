import { Badge } from '@shared/components/ui/badge';
import { ROLES_MODULE } from '../constants/roles.constants';

export function RolesSummary() {
  return (
    <div className="module-summary">
      {ROLES_MODULE.capabilities.map((capability) => (
        <Badge key={capability}>{capability}</Badge>
      ))}
    </div>
  );
}
