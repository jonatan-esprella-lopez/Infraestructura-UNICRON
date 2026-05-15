import type { ApplicationModule, AppServices } from '../core/types/api.types.js';
import { createAiAssistantModule } from './ai-assistant/index.js';
import { createAnalyticsModule } from './analytics/index.js';
import { createAuthModule } from './auth/index.js';
import { createCampaignsModule } from './campaigns/index.js';
import { createCrmModule } from './crm/index.js';
import { createDashboardModule } from './dashboard/index.js';
import { createDocumentsModule } from './documents/index.js';
import { createGeolocationModule } from './geolocation/index.js';
import { createNotificationsModule } from './notifications/index.js';
import { createPermissionsModule } from './permissions/index.js';
import { createQrModule } from './qr/index.js';
import { createRolesModule } from './roles/index.js';
import { createScoringModule } from './scoring/index.js';
import { createSettingsModule } from './settings/index.js';
import { createTenantsModule } from './tenants/index.js';
import { createUsersModule } from './users/index.js';
import { createWalletsModule } from './wallets/index.js';

export function createModules(services: AppServices): ApplicationModule[] {
  return [
    createAuthModule(services),
    createUsersModule(services),
    createRolesModule(services),
    createPermissionsModule(services),
    createTenantsModule(services),
    createDashboardModule(services),
    createAnalyticsModule(services),
    createCrmModule(services),
    createCampaignsModule(services),
    createNotificationsModule(services),
    createDocumentsModule(services),
    createScoringModule(services),
    createWalletsModule(services),
    createQrModule(services),
    createGeolocationModule(services),
    createAiAssistantModule(services),
    createSettingsModule(services),
  ];
}
