import { Badge } from '@shared/components/ui/badge';
import '@modules/_shared/module-summary/ModuleSummary.css';
import { QR_MODULE } from '../constants/qr.constants';

export function QrSummary() {
  return (
    <div className="module-summary">
      {QR_MODULE.capabilities.map((capability) => (
        <Badge key={capability}>{capability}</Badge>
      ))}
    </div>
  );
}
