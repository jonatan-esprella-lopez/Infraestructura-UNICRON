import { ModuleOverviewPage } from '@modules/_shared/module-page/ModuleOverviewPage';
import { SETTINGS_MODULE } from '../constants/settings.constants';

export function SettingsPage() {
  return (
    <ModuleOverviewPage
      title={SETTINGS_MODULE.title}
      description={SETTINGS_MODULE.description}
      capabilities={[...SETTINGS_MODULE.capabilities]}
      metrics={[
        { label: 'Estado', value: 'Ready', trend: 'Base enterprise' },
        { label: 'Integraciones', value: String(SETTINGS_MODULE.capabilities.length), trend: 'Preparadas' },
        { label: 'Modo', value: 'Modular', trend: 'Feature flag' },
      ]}
    />
  );
}
