import { Badge } from '@shared/components/ui/badge';
import { CAMPAIGNS_MODULE } from '../constants/campaigns.constants';

export function CampaignsSummary() {
  return (
    <div className="module-summary">
      {CAMPAIGNS_MODULE.capabilities.map((capability) => (
        <Badge key={capability}>{capability}</Badge>
      ))}
    </div>
  );
}
