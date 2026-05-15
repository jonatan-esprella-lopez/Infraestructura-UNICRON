import { ModuleOverviewPage } from '@modules/_shared/module-page/ModuleOverviewPage';
import { ANALYTICS_MODULE } from '../constants/analytics.constants';

export function AnalyticsPage() {
  return (
    <ModuleOverviewPage
      title={ANALYTICS_MODULE.title}
      description={ANALYTICS_MODULE.description}
      capabilities={[...ANALYTICS_MODULE.capabilities]}
      metrics={[
        { label: 'Estado', value: 'Ready', trend: 'Base enterprise' },
        { label: 'Integraciones', value: String(ANALYTICS_MODULE.capabilities.length), trend: 'Preparadas' },
        { label: 'Modo', value: 'Modular', trend: 'Feature flag' },
      ]}
    />
  );
}
