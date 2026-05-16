import {
  BarChart3,
  Bot,
  BriefcaseBusiness,
  Building2,
  CalendarCheck,
  FileSignature,
  FileText,
  Gauge,
  HandshakeIcon,
  Megaphone,
  QrCode,
  Settings,
  Shield,
  Sparkles,
  TrendingUp,
  UserRoundSearch,
  Users,
  WalletCards,
  Workflow,
  type LucideIcon,
} from 'lucide-react';
import type { FeatureFlagKey } from '@bootstrap/environment';
import { Permission } from '@core/enums/permissions.enum';
import { Role } from '@core/enums/roles.enum';
import { ModuleKey } from '@core/enums/modules.enum';
import { ROUTES } from './route.constants';

export interface RoleRoute {
  key: ModuleKey;
  label: string;
  path: string;
  icon: LucideIcon;
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
  // --- Proptech ---
  { key: ModuleKey.ProptechDashboard, label: 'Inmuebles', path: ROUTES.proptech, icon: Building2, featureFlag: 'proptech', permissions: [Permission.AccessProptech], roles: [Role.Admin, Role.Manager, Role.AgencyAdmin, Role.Agent, Role.Owner, Role.Client] },
  { key: ModuleKey.ProptechProperties, label: 'Propiedades', path: ROUTES.proptechProperties, icon: Building2, featureFlag: 'proptech', permissions: [Permission.PropPropertyRead], roles: [Role.Admin, Role.Manager, Role.AgencyAdmin, Role.Agent] },
  { key: ModuleKey.ProptechLeads, label: 'Leads', path: ROUTES.proptechLeads, icon: UserRoundSearch, featureFlag: 'proptech', permissions: [Permission.AccessCrm], roles: [Role.Admin, Role.Manager, Role.AgencyAdmin, Role.Agent] },
  { key: ModuleKey.ProptechClients, label: 'Clientes', path: ROUTES.proptechClients, icon: Users, featureFlag: 'proptech', permissions: [Permission.AccessProptech], roles: [Role.Admin, Role.Manager, Role.AgencyAdmin, Role.Agent] },
  { key: ModuleKey.ProptechVisits, label: 'Visitas', path: ROUTES.proptechVisits, icon: CalendarCheck, featureFlag: 'proptech', permissions: [Permission.PropMatchingRead ?? Permission.AccessProptech], roles: [Role.Admin, Role.Manager, Role.AgencyAdmin, Role.Agent, Role.Owner, Role.Client] },
  { key: ModuleKey.ProptechMatching, label: 'Matching IA', path: ROUTES.proptechMatching, icon: Sparkles, featureFlag: 'proptech', permissions: [Permission.PropMatchingGenerate], roles: [Role.Admin, Role.Manager, Role.AgencyAdmin, Role.Agent] },
  { key: ModuleKey.ProptechContracts, label: 'Contratos', path: ROUTES.proptechContracts, icon: FileSignature, featureFlag: 'proptech', permissions: [Permission.PropContractReviewAi], roles: [Role.Admin, Role.Manager, Role.AgencyAdmin, Role.LegalReviewer] },
  { key: ModuleKey.ProptechAnalytics, label: 'Mercado', path: ROUTES.proptechAnalytics, icon: TrendingUp, featureFlag: 'proptech', permissions: [Permission.PropMarketInsightsRead], roles: [Role.Admin, Role.Manager, Role.AgencyAdmin] },
];
