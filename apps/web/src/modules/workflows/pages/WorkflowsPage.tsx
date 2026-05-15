import { ModuleOverviewPage } from '@modules/_shared/module-page/ModuleOverviewPage';
import { WORKFLOWS_MODULE } from '../constants/workflows.constants';

export function WorkflowsPage() {
  return (
    <ModuleOverviewPage
      title={WORKFLOWS_MODULE.title}
      description={WORKFLOWS_MODULE.description}
      capabilities={[...WORKFLOWS_MODULE.capabilities]}
      metrics={[
        { label: 'Estado', value: 'Ready', trend: 'Base enterprise' },
        { label: 'Integraciones', value: String(WORKFLOWS_MODULE.capabilities.length), trend: 'Preparadas' },
        { label: 'Modo', value: 'Modular', trend: 'Feature flag' },
      ]}
    />
  );
}
