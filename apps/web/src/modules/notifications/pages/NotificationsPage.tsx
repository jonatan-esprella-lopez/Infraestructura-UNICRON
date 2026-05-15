import { ModuleOverviewPage } from '@modules/_shared/module-page/ModuleOverviewPage';
import { NOTIFICATIONS_MODULE } from '../constants/notifications.constants';

export function NotificationsPage() {
  return (
    <ModuleOverviewPage
      title={NOTIFICATIONS_MODULE.title}
      description={NOTIFICATIONS_MODULE.description}
      capabilities={[...NOTIFICATIONS_MODULE.capabilities]}
      metrics={[
        { label: 'Estado', value: 'Ready', trend: 'Base enterprise' },
        { label: 'Integraciones', value: String(NOTIFICATIONS_MODULE.capabilities.length), trend: 'Preparadas' },
        { label: 'Modo', value: 'Modular', trend: 'Feature flag' },
      ]}
    />
  );
}
