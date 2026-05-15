import { ModuleOverviewPage } from '@modules/_shared/module-page/ModuleOverviewPage';
import { DASHBOARD_MODULE } from '../constants/dashboard.constants';

export function DashboardPage() {
  return (
    <ModuleOverviewPage
      title={DASHBOARD_MODULE.title}
      description={DASHBOARD_MODULE.description}
      capabilities={[...DASHBOARD_MODULE.capabilities]}
      metrics={[
        { label: 'Estado', value: 'Ready', trend: 'Base enterprise' },
        { label: 'Integraciones', value: String(DASHBOARD_MODULE.capabilities.length), trend: 'Preparadas' },
        { label: 'Modo', value: 'Modular', trend: 'Feature flag' },
      ]}
    />
  );
}
