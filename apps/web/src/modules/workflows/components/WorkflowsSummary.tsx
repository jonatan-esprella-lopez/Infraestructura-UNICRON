import { Badge } from '@shared/components/ui/badge';
import '@modules/_shared/module-summary/ModuleSummary.css';
import { WORKFLOWS_MODULE } from '../constants/workflows.constants';

export function WorkflowsSummary() {
  return (
    <div className="module-summary">
      {WORKFLOWS_MODULE.capabilities.map((capability) => (
        <Badge key={capability}>{capability}</Badge>
      ))}
    </div>
  );
}
