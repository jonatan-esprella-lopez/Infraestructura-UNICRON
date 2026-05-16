import { ModuleOverviewPage } from '@modules/_shared/module-page/ModuleOverviewPage';
import { ROLES_MODULE } from '../constants/roles.constants';

export function RolesPage() {
  return (
    <ModuleOverviewPage
      title={ROLES_MODULE.title}
      description={ROLES_MODULE.description}
      capabilities={[...ROLES_MODULE.capabilities]}
      metrics={[
        { label: 'Estado', value: 'Ready', trend: 'Base enterprise' },
        { label: 'Integraciones', value: String(ROLES_MODULE.capabilities.length), trend: 'Preparadas' },
        { label: 'Modo', value: 'Modular', trend: 'Feature flag' },
      ]}
    />
  );
}
