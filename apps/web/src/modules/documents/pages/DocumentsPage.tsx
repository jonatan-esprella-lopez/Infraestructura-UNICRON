import { ModuleOverviewPage } from '@modules/_shared/module-page/ModuleOverviewPage';
import { DOCUMENTS_MODULE } from '../constants/documents.constants';

export function DocumentsPage() {
  return (
    <ModuleOverviewPage
      title={DOCUMENTS_MODULE.title}
      description={DOCUMENTS_MODULE.description}
      capabilities={[...DOCUMENTS_MODULE.capabilities]}
      metrics={[
        { label: 'Estado', value: 'Ready', trend: 'Base enterprise' },
        { label: 'Integraciones', value: String(DOCUMENTS_MODULE.capabilities.length), trend: 'Preparadas' },
        { label: 'Modo', value: 'Modular', trend: 'Feature flag' },
      ]}
    />
  );
}
