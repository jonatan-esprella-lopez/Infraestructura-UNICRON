import {
  BarChart3,
  Bot,
  BriefcaseBusiness,
  FileText,
  Gauge,
  Megaphone,
  QrCode,
  Settings,
  Shield,
  Users,
  WalletCards,
  Workflow,
} from 'lucide-react';
import type { ComponentType } from 'react';
import type { FeatureFlagKey } from '@bootstrap/environment';
import { Permission } from '@core/enums/permissions.enum';
import { Role } from '@core/enums/roles.enum';
import { ModuleKey } from '@core/enums/modules.enum';
import { ROUTES } from './route.constants';

export interface RoleRoute {
  key: ModuleKey;
  label: string;
  path: string;
  icon: ComponentType<{ size?: number }>;
  featureFlag?: FeatureFlagKey;
  permissions: Permission[];
  roles: Role[];
}

export const roleRoutes: RoleRoute[] = [
  { key: ModuleKey.Dashboard, label: 'Dashboard', path: ROUTES.dashboard, icon: Gauge, permissions: [Permission.ViewDashboard], roles: [Role.Admin, Role.Manager, Role.Operator, Role.Viewer] },
  { key: ModuleKey.Crm, label: 'CRM', path: ROUTES.crm, icon: BriefcaseBusiness, featureFlag: 'crm', permissions: [Permission.AccessCrm], roles: [Role.Admin, Role.Manager, Role.Operator] },
  { key: ModuleKey.Analytics, label: 'Analytics', path: ROUTES.analytics, icon: BarChart3, featureFlag: 'analytics', permissions: [Permission.AccessAnalytics], roles: [Role.Admin, Role.Manager, Role.Viewer] },
  { key: ModuleKey.AiAssistant, label: 'AI Assistant', path: ROUTES.aiAssistant, icon: Bot, featureFlag: 'ai', permissions: [Permission.AccessAi], roles: [Role.Admin, Role.Manager] },
  { key: ModuleKey.Campaigns, label: 'Campaigns', path: ROUTES.campaigns, icon: Megaphone, featureFlag: 'campaigns', permissions: [Permission.AccessCampaigns], roles: [Role.Admin, Role.Manager, Role.Operator] },
  { key: ModuleKey.Documents, label: 'Documents', path: ROUTES.documents, icon: FileText, featureFlag: 'documents', permissions: [Permission.AccessDocuments], roles: [Role.Admin, Role.Manager, Role.Operator] },
  { key: ModuleKey.Scoring, label: 'Scoring', path: ROUTES.scoring, icon: WalletCards, featureFlag: 'scoring', permissions: [Permission.AccessScoring], roles: [Role.Admin, Role.Manager] },
  { key: ModuleKey.Qr, label: 'QR', path: ROUTES.qr, icon: QrCode, featureFlag: 'qr', permissions: [Permission.AccessQr], roles: [Role.Admin, Role.Manager, Role.Operator] },
  { key: ModuleKey.Notifications, label: 'Notifications', path: ROUTES.notifications, icon: Shield, featureFlag: 'notifications', permissions: [Permission.AccessNotifications], roles: [Role.Admin, Role.Manager, Role.Operator] },
  { key: ModuleKey.Users, label: 'Users', path: ROUTES.users, icon: Users, featureFlag: 'users', permissions: [Permission.ManageUsers], roles: [Role.Admin] },
  { key: ModuleKey.Roles, label: 'Roles', path: ROUTES.roles, icon: Shield, featureFlag: 'roles', permissions: [Permission.ManageRoles], roles: [Role.Admin] },
  { key: ModuleKey.Settings, label: 'Settings', path: ROUTES.settings, icon: Settings, featureFlag: 'settings', permissions: [Permission.ManageSettings], roles: [Role.Admin] },
  { key: ModuleKey.Workflows, label: 'Workflows', path: ROUTES.workflows, icon: Workflow, featureFlag: 'workflows', permissions: [Permission.AccessWorkflows], roles: [Role.Admin, Role.Manager] },
];
