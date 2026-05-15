import { ModuleOverviewPage } from '@modules/_shared/module-page/ModuleOverviewPage';
import { USERS_MODULE } from '../constants/users.constants';

export function UsersPage() {
  return (
    <ModuleOverviewPage
      title={USERS_MODULE.title}
      description={USERS_MODULE.description}
      capabilities={[...USERS_MODULE.capabilities]}
      metrics={[
        { label: 'Estado', value: 'Ready', trend: 'Base enterprise' },
        { label: 'Integraciones', value: String(USERS_MODULE.capabilities.length), trend: 'Preparadas' },
        { label: 'Modo', value: 'Modular', trend: 'Feature flag' },
      ]}
    />
  );
}
