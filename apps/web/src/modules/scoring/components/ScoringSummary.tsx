import { Badge } from '@shared/components/ui/badge';
import '@modules/_shared/module-summary/ModuleSummary.css';
import { SCORING_MODULE } from '../constants/scoring.constants';

export function ScoringSummary() {
  return (
    <div className="module-summary">
      {SCORING_MODULE.capabilities.map((capability) => (
        <Badge key={capability}>{capability}</Badge>
      ))}
    </div>
  );
}
