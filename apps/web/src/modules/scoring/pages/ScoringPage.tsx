import { ModuleOverviewPage } from '@modules/_shared/module-page/ModuleOverviewPage';
import { SCORING_MODULE } from '../constants/scoring.constants';

export function ScoringPage() {
  return (
    <ModuleOverviewPage
      title={SCORING_MODULE.title}
      description={SCORING_MODULE.description}
      capabilities={[...SCORING_MODULE.capabilities]}
      metrics={[
        { label: 'Estado', value: 'Ready', trend: 'Base enterprise' },
        { label: 'Integraciones', value: String(SCORING_MODULE.capabilities.length), trend: 'Preparadas' },
        { label: 'Modo', value: 'Modular', trend: 'Feature flag' },
      ]}
    />
  );
}
