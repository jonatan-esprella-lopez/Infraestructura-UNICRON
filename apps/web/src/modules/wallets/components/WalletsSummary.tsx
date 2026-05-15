import { Badge } from '@shared/components/ui/badge';
import '@modules/_shared/module-summary/ModuleSummary.css';
import { WALLETS_MODULE } from '../constants/wallets.constants';

export function WalletsSummary() {
  return (
    <div className="module-summary">
      {WALLETS_MODULE.capabilities.map((capability) => (
        <Badge key={capability}>{capability}</Badge>
      ))}
    </div>
  );
}
