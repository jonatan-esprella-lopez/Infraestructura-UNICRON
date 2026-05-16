import { ModuleOverviewPage } from '@modules/_shared/module-page/ModuleOverviewPage';
import { MARKETPLACES_MODULE } from '../constants/marketplaces.constants';

export function MarketplacesPage() {
  return (
    <ModuleOverviewPage
      title={MARKETPLACES_MODULE.title}
      description={MARKETPLACES_MODULE.description}
      capabilities={[...MARKETPLACES_MODULE.capabilities]}
      metrics={[
        { label: 'Estado', value: 'Ready', trend: 'Base enterprise' },
        { label: 'Integraciones', value: String(MARKETPLACES_MODULE.capabilities.length), trend: 'Preparadas' },
        { label: 'Modo', value: 'Modular', trend: 'Feature flag' },
      ]}
    />
  );
}
