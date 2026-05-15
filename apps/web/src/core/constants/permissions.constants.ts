import { Permission } from '@core/enums/permissions.enum';
import { Role } from '@core/enums/roles.enum';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.Admin]: Object.values(Permission),
  [Role.Manager]: [
    Permission.ViewDashboard,
    Permission.AccessCrm,
    Permission.AccessAnalytics,
    Permission.AccessAi,
    Permission.AccessCampaigns,
    Permission.AccessDocuments,
    Permission.AccessScoring,
    Permission.AccessQr,
    Permission.AccessNotifications,
    Permission.AccessWorkflows,
  ],
  [Role.Operator]: [
    Permission.ViewDashboard,
    Permission.AccessCrm,
    Permission.AccessCampaigns,
    Permission.AccessDocuments,
    Permission.AccessQr,
    Permission.AccessNotifications,
  ],
  [Role.Viewer]: [Permission.ViewDashboard, Permission.AccessAnalytics],
};
