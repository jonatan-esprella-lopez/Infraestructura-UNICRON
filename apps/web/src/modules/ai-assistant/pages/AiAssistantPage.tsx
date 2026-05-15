import { ModuleOverviewPage } from '@modules/_shared/module-page/ModuleOverviewPage';
import { AIASSISTANT_MODULE } from '../constants/ai-assistant.constants';

export function AiAssistantPage() {
  return (
    <ModuleOverviewPage
      title={AIASSISTANT_MODULE.title}
      description={AIASSISTANT_MODULE.description}
      capabilities={[...AIASSISTANT_MODULE.capabilities]}
      metrics={[
        { label: 'Estado', value: 'Ready', trend: 'Base enterprise' },
        { label: 'Integraciones', value: String(AIASSISTANT_MODULE.capabilities.length), trend: 'Preparadas' },
        { label: 'Modo', value: 'Modular', trend: 'Feature flag' },
      ]}
    />
  );
}
