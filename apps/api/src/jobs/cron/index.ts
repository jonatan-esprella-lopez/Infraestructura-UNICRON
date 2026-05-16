import type { AppServices } from '../../core/types/api.types.js';

export function registerCronJobs(services: AppServices): void {
  services.logger.info('Scheduler initialized', { jobs: [] });
}
