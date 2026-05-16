import { ModuleName } from '../../core/enums/module.enum.js';
import type { AppServices } from '../../core/types/api.types.js';
import { createFeatureModule } from '../_shared/feature-module.factory.js';

export function createDashboardModule(services: AppServices) {
  return createFeatureModule(
    {
      basePath: '/dashboard',
      capabilities: ['summary-widgets', 'module-status', 'kpi-snapshots'],
      description: 'Operational dashboard aggregation layer.',
      name: ModuleName.Dashboard,
    },
    services,
  );
}
