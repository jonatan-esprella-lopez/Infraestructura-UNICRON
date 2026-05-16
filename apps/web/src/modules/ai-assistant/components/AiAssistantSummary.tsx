import { Badge } from '@shared/components/ui/badge';
import '@modules/_shared/module-summary/ModuleSummary.css';
import { AIASSISTANT_MODULE } from '../constants/ai-assistant.constants';

export function AiAssistantSummary() {
  return (
    <div className="module-summary">
      {AIASSISTANT_MODULE.capabilities.map((capability) => (
        <Badge key={capability}>{capability}</Badge>
      ))}
    </div>
  );
}
