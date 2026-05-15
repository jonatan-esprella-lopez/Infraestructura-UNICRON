import { ModuleOverviewPage } from '@modules/_shared/module-page/ModuleOverviewPage';
import { QR_MODULE } from '../constants/qr.constants';

export function QrPage() {
  return (
    <ModuleOverviewPage
      title={QR_MODULE.title}
      description={QR_MODULE.description}
      capabilities={[...QR_MODULE.capabilities]}
      metrics={[
        { label: 'Estado', value: 'Ready', trend: 'Base enterprise' },
        { label: 'Integraciones', value: String(QR_MODULE.capabilities.length), trend: 'Preparadas' },
        { label: 'Modo', value: 'Modular', trend: 'Feature flag' },
      ]}
    />
  );
}
