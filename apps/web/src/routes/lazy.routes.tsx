import { lazy } from 'react';
import { Permission } from '@core/enums/permissions.enum';
import { Role } from '@core/enums/roles.enum';
import type { FeatureFlagKey } from '@bootstrap/environment';

const DashboardPage = lazy(() => import('@modules/dashboard/pages/DashboardPage').then((module) => ({ default: module.DashboardPage })));
const MatcherPage = lazy(() => import('@modules/matcher/pages/MatcherPage').then((module) => ({ default: module.MatcherPage })));
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

// Proptech — router inteligente por rol
const ProptechDashboardRouter = lazy(() => import('@modules/proptech/shared/components/proptech-dashboard-router/proptech-dashboard-router').then((m) => ({ default: m.ProptechDashboardRouter })));
// Proptech — páginas compartidas
const PropertyListPage = lazy(() => import('@modules/proptech/pages/property-list-page/property-list-page').then((m) => ({ default: m.PropertyListPage })));
const PropertyMatchingPage = lazy(() => import('@modules/proptech/pages/property-matching-page/property-matching-page').then((m) => ({ default: m.PropertyMatchingPage })));
const PropertyContractsPage = lazy(() => import('@modules/proptech/pages/property-contracts-page/property-contracts-page').then((m) => ({ default: m.PropertyContractsPage })));
// Proptech — páginas públicas
const PublicPropertySearchPage = lazy(() => import('@modules/proptech/public/pages/public-property-search-page/public-property-search-page').then((m) => ({ default: m.PublicPropertySearchPage })));

export const lazyModuleRoutes = [
  { path: 'dashboard', element: <DashboardPage />, permissions: [Permission.ViewDashboard], roles: [Role.Admin, Role.Manager, Role.Operator, Role.Viewer] },
  { path: 'matcher', element: <MatcherPage />, permissions: [], roles: [] },
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
  // Proptech — dashboard inteligente por rol
  { path: 'proptech', element: <ProptechDashboardRouter />, featureFlag: 'proptech' as FeatureFlagKey, permissions: [Permission.AccessProptech], roles: [Role.Admin, Role.Manager, Role.AgencyAdmin, Role.Agent, Role.Owner, Role.Client] },
  // Proptech — páginas operativas
  { path: 'proptech/properties', element: <PropertyListPage />, featureFlag: 'proptech' as FeatureFlagKey, permissions: [Permission.PropPropertyRead], roles: [Role.Admin, Role.Manager, Role.AgencyAdmin, Role.Agent, Role.Viewer] },
  { path: 'proptech/matching', element: <PropertyMatchingPage />, featureFlag: 'proptech' as FeatureFlagKey, permissions: [Permission.PropMatchingGenerate], roles: [Role.Admin, Role.Manager, Role.AgencyAdmin, Role.Agent] },
  { path: 'proptech/contracts', element: <PropertyContractsPage />, featureFlag: 'proptech' as FeatureFlagKey, permissions: [Permission.PropContractReviewAi], roles: [Role.Admin, Role.Manager, Role.AgencyAdmin, Role.LegalReviewer] },
  // Proptech — páginas adicionales (visitas, leads, clientes, analítica) reutilizan PropertyListPage como placeholder hasta implementar cada una
  { path: 'proptech/visits', element: <PropertyListPage />, featureFlag: 'proptech' as FeatureFlagKey, permissions: [Permission.AccessProptech], roles: [Role.Admin, Role.Manager, Role.AgencyAdmin, Role.Agent, Role.Owner, Role.Client] },
  { path: 'proptech/leads', element: <PropertyListPage />, featureFlag: 'proptech' as FeatureFlagKey, permissions: [Permission.AccessCrm], roles: [Role.Admin, Role.Manager, Role.AgencyAdmin, Role.Agent] },
  { path: 'proptech/clients', element: <PropertyListPage />, featureFlag: 'proptech' as FeatureFlagKey, permissions: [Permission.AccessProptech], roles: [Role.Admin, Role.Manager, Role.AgencyAdmin, Role.Agent] },
  { path: 'proptech/analytics', element: <PropertyListPage />, featureFlag: 'proptech' as FeatureFlagKey, permissions: [Permission.PropMarketInsightsRead], roles: [Role.Admin, Role.Manager, Role.AgencyAdmin] },
  // Proptech — búsqueda pública (sin restricción de permisos especiales)
  { path: 'proptech/search', element: <PublicPropertySearchPage />, featureFlag: 'proptech' as FeatureFlagKey, permissions: [], roles: [Role.Admin, Role.Manager, Role.AgencyAdmin, Role.Agent, Role.Owner, Role.Client, Role.Viewer] },
];
