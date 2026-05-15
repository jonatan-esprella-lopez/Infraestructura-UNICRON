import { Badge } from '@shared/components/ui/badge';
import { GAMIFICATION_MODULE } from '../constants/gamification.constants';

export function GamificationSummary() {
  return (
    <div className="module-summary">
      {GAMIFICATION_MODULE.capabilities.map((capability) => (
        <Badge key={capability}>{capability}</Badge>
      ))}
    </div>
  );
}
