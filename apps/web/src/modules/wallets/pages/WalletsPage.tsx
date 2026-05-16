import { ModuleOverviewPage } from '@modules/_shared/module-page/ModuleOverviewPage';
import { WALLETS_MODULE } from '../constants/wallets.constants';

export function WalletsPage() {
  return (
    <ModuleOverviewPage
      title={WALLETS_MODULE.title}
      description={WALLETS_MODULE.description}
      capabilities={[...WALLETS_MODULE.capabilities]}
      metrics={[
        { label: 'Estado', value: 'Ready', trend: 'Base enterprise' },
        { label: 'Integraciones', value: String(WALLETS_MODULE.capabilities.length), trend: 'Preparadas' },
        { label: 'Modo', value: 'Modular', trend: 'Feature flag' },
      ]}
    />
  );
}
