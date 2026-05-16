import { Badge } from '@shared/components/ui/badge';
import '@modules/_shared/module-summary/ModuleSummary.css';
import { MARKETPLACES_MODULE } from '../constants/marketplaces.constants';

export function MarketplacesSummary() {
  return (
    <div className="module-summary">
      {MARKETPLACES_MODULE.capabilities.map((capability) => (
        <Badge key={capability}>{capability}</Badge>
      ))}
    </div>
  );
}
