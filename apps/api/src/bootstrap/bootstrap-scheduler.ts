import type { AppServices } from '../core/types/api.types.js';
import { registerCronJobs } from '../jobs/cron/index.js';

export function bootstrapScheduler(services: AppServices): void {
  registerCronJobs(services);
}
