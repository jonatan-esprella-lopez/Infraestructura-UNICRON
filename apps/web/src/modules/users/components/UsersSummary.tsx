import { Badge } from '@shared/components/ui/badge';
import { USERS_MODULE } from '../constants/users.constants';

export function UsersSummary() {
  return (
    <div className="module-summary">
      {USERS_MODULE.capabilities.map((capability) => (
        <Badge key={capability}>{capability}</Badge>
      ))}
    </div>
  );
}
