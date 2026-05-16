import { ModuleOverviewPage } from '@modules/_shared/module-page/ModuleOverviewPage';
import { GAMIFICATION_MODULE } from '../constants/gamification.constants';

export function GamificationPage() {
  return (
    <ModuleOverviewPage
      title={GAMIFICATION_MODULE.title}
      description={GAMIFICATION_MODULE.description}
      capabilities={[...GAMIFICATION_MODULE.capabilities]}
      metrics={[
        { label: 'Estado', value: 'Ready', trend: 'Base enterprise' },
        { label: 'Integraciones', value: String(GAMIFICATION_MODULE.capabilities.length), trend: 'Preparadas' },
        { label: 'Modo', value: 'Modular', trend: 'Feature flag' },
      ]}
    />
  );
}
