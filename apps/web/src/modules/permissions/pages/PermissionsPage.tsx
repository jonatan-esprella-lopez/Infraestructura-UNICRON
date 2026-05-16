import { ModuleOverviewPage } from '@modules/_shared/module-page/ModuleOverviewPage';
import { PERMISSIONS_MODULE } from '../constants/permissions.constants';

export function PermissionsPage() {
  return (
    <ModuleOverviewPage
      title={PERMISSIONS_MODULE.title}
      description={PERMISSIONS_MODULE.description}
      capabilities={[...PERMISSIONS_MODULE.capabilities]}
      metrics={[
        { label: 'Estado', value: 'Ready', trend: 'Base enterprise' },
        { label: 'Integraciones', value: String(PERMISSIONS_MODULE.capabilities.length), trend: 'Preparadas' },
        { label: 'Modo', value: 'Modular', trend: 'Feature flag' },
      ]}
    />
  );
}
