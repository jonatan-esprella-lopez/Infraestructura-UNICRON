import { ModuleOverviewPage } from '@modules/_shared/module-page/ModuleOverviewPage';
import { CAMPAIGNS_MODULE } from '../constants/campaigns.constants';

export function CampaignsPage() {
  return (
    <ModuleOverviewPage
      title={CAMPAIGNS_MODULE.title}
      description={CAMPAIGNS_MODULE.description}
      capabilities={[...CAMPAIGNS_MODULE.capabilities]}
      metrics={[
        { label: 'Estado', value: 'Ready', trend: 'Base enterprise' },
        { label: 'Integraciones', value: String(CAMPAIGNS_MODULE.capabilities.length), trend: 'Preparadas' },
        { label: 'Modo', value: 'Modular', trend: 'Feature flag' },
      ]}
    />
  );
}
