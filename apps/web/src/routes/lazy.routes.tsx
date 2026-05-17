import { lazy } from 'react';
import { Permission } from '@core/enums/permissions.enum';
import { Role } from '@core/enums/roles.enum';
import type { FeatureFlagKey } from '@bootstrap/environment';

const DashboardPage = lazy(() => import('@modules/dashboard/pages/DashboardPage').then((module) => ({ default: module.DashboardPage })));
const MatcherPage = lazy(() => import('@modules/matcher/pages/MatcherPage').then((module) => ({ default: module.MatcherPage })));
const ContractsPage = lazy(() => import('@modules/contracts/pages/ContractsPage').then((module) => ({ default: module.ContractsPage })));
const ChatPage = lazy(() => import('@modules/chat/pages/ChatPage').then((module) => ({ default: module.ChatPage })));
const FinancialAdvisorPage = lazy(() => import('@modules/financial-advisor/pages/FinancialAdvisorPage').then((module) => ({ default: module.FinancialAdvisorPage })));
const CRMPage = lazy(() => import('@modules/crm/pages/CRMPage').then((module) => ({ default: module.CRMPage })));
const AnalyticsPage = lazy(() => import('@modules/analytics/pages/AnalyticsPage').then((module) => ({ default: module.AnalyticsPage })));
const AiAssistantPage = lazy(() => import('@modules/ai-assistant/pages/AiAssistantPage').then((module) => ({ default: module.AiAssistantPage })));
const CampaignsPage = lazy(() => import('@modules/campaigns/pages/CampaignsPage').then((module) => ({ default: module.CampaignsPage })));
const DocumentsPage = lazy(() => import('@modules/documents/pages/DocumentsPage').then((module) => ({ default: module.DocumentsPage })));
const ScoringPage = lazy(() => import('@modules/scoring/pages/ScoringPage').then((module) => ({ default: module.ScoringPage })));
const QrPage = lazy(() => import('@modules/qr/pages/QrPage').then((module) => ({ default: module.QrPage })));
const NotificationsPage = lazy(() => import('@modules/notifications/pages/NotificationsPage').then((module) => ({ default: module.NotificationsPage })));
const UsersPage = lazy(() => import('@modules/users/pages/UsersPage').then((module) => ({ default: module.UsersPage })));
const RolesPage = lazy(() => import('@modules/roles/pages/RolesPage').then((module) => ({ default: module.RolesPage })));
const SettingsPage = lazy(() => import('@modules/settings/pages/SettingsPage').then((module) => ({ default: module.SettingsPage })));
const WorkflowsPage = lazy(() => import('@modules/workflows/pages/WorkflowsPage').then((module) => ({ default: module.WorkflowsPage })));

export const lazyModuleRoutes = [
  { path: 'dashboard', element: <DashboardPage />, permissions: [Permission.ViewDashboard], roles: [Role.Admin, Role.Manager, Role.Operator, Role.Viewer] },
  { path: 'chat', element: <ChatPage />, permissions: [], roles: [] },
  { path: 'financial-advisor', element: <FinancialAdvisorPage />, permissions: [], roles: [] },
  { path: 'matcher', element: <MatcherPage />, permissions: [], roles: [] },
  { path: 'contracts', element: <ContractsPage />, permissions: [], roles: [] },
  { path: 'crm', element: <CRMPage />, featureFlag: 'crm' as FeatureFlagKey, permissions: [Permission.AccessCrm], roles: [Role.Admin, Role.Manager, Role.Operator] },
  { path: 'analytics', element: <AnalyticsPage />, featureFlag: 'analytics' as FeatureFlagKey, permissions: [Permission.AccessAnalytics], roles: [Role.Admin, Role.Manager, Role.Viewer] },
  { path: 'ai-assistant', element: <AiAssistantPage />, featureFlag: 'ai' as FeatureFlagKey, permissions: [Permission.AccessAi], roles: [Role.Admin, Role.Manager] },
  { path: 'campaigns', element: <CampaignsPage />, featureFlag: 'campaigns' as FeatureFlagKey, permissions: [Permission.AccessCampaigns], roles: [Role.Admin, Role.Manager, Role.Operator] },
  { path: 'documents', element: <DocumentsPage />, featureFlag: 'documents' as FeatureFlagKey, permissions: [Permission.AccessDocuments], roles: [Role.Admin, Role.Manager, Role.Operator] },
  { path: 'scoring', element: <ScoringPage />, featureFlag: 'scoring' as FeatureFlagKey, permissions: [Permission.AccessScoring], roles: [Role.Admin, Role.Manager] },
  { path: 'qr', element: <QrPage />, featureFlag: 'qr' as FeatureFlagKey, permissions: [Permission.AccessQr], roles: [Role.Admin, Role.Manager, Role.Operator] },
  { path: 'notifications', element: <NotificationsPage />, featureFlag: 'notifications' as FeatureFlagKey, permissions: [Permission.AccessNotifications], roles: [Role.Admin, Role.Manager, Role.Operator] },
  { path: 'users', element: <UsersPage />, featureFlag: 'users' as FeatureFlagKey, permissions: [Permission.ManageUsers], roles: [Role.Admin] },
  { path: 'roles', element: <RolesPage />, featureFlag: 'roles' as FeatureFlagKey, permissions: [Permission.ManageRoles], roles: [Role.Admin] },
  { path: 'settings', element: <SettingsPage />, featureFlag: 'settings' as FeatureFlagKey, permissions: [Permission.ManageSettings], roles: [Role.Admin] },
  { path: 'workflows', element: <WorkflowsPage />, featureFlag: 'workflows' as FeatureFlagKey, permissions: [Permission.AccessWorkflows], roles: [Role.Admin, Role.Manager] },
];
