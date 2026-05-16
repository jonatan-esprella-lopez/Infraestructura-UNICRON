import { Badge } from '@shared/components/ui/badge';
import '@modules/_shared/module-summary/ModuleSummary.css';
import { SETTINGS_MODULE } from '../constants/settings.constants';

export function SettingsSummary() {
  return (
    <div className="module-summary">
      {SETTINGS_MODULE.capabilities.map((capability) => (
        <Badge key={capability}>{capability}</Badge>
      ))}
    </div>
  );
}
