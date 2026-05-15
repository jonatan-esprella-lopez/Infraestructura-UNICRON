import { Badge } from '@shared/components/ui/badge';
import '@modules/_shared/module-summary/ModuleSummary.css';
import { DOCUMENTS_MODULE } from '../constants/documents.constants';

export function DocumentsSummary() {
  return (
    <div className="module-summary">
      {DOCUMENTS_MODULE.capabilities.map((capability) => (
        <Badge key={capability}>{capability}</Badge>
      ))}
    </div>
  );
}
