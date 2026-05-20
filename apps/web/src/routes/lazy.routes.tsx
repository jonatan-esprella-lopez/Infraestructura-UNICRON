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

// Proptech — dashboard router (role-aware)
const ProptechDashboardRouter = lazy(() => import('@modules/proptech/shared/components/proptech-dashboard-router/proptech-dashboard-router').then((m) => ({ default: m.ProptechDashboardRouter })));
// Proptech — shared pages
const ProptechPropertiesRouter = lazy(() => import('@modules/proptech/shared/components/proptech-properties-router/proptech-properties-router').then((m) => ({ default: m.ProptechPropertiesRouter })));
const PropertyCreatePage = lazy(() => import('@modules/proptech/pages/property-create-page/property-create-page').then((m) => ({ default: m.PropertyCreatePage })));
const PropertyListPage = lazy(() => import('@modules/proptech/pages/property-list-page/property-list-page').then((m) => ({ default: m.PropertyListPage })));
const PropertyMatchingPage = lazy(() => import('@modules/proptech/pages/property-matching-page/property-matching-page').then((m) => ({ default: m.PropertyMatchingPage })));
const ProptechMatchingRouter = lazy(() => import('@modules/proptech/shared/components/proptech-matching-router/proptech-matching-router').then((m) => ({ default: m.ProptechMatchingRouter })));
const PropertyContractsPage = lazy(() => import('@modules/proptech/pages/property-contracts-page/property-contracts-page').then((m) => ({ default: m.PropertyContractsPage })));
// Proptech — public
const PublicPropertySearchPage = lazy(() => import('@modules/proptech/public/pages/public-property-search-page/public-property-search-page').then((m) => ({ default: m.PublicPropertySearchPage })));
// Proptech — admin pages
const AdminSalesPage = lazy(() => import('@modules/proptech/admin/pages/admin-sales-page/admin-sales-page').then((m) => ({ default: m.AdminSalesPage })));
const AdminReportsPage = lazy(() => import('@modules/proptech/admin/pages/admin-reports-page/admin-reports-page').then((m) => ({ default: m.AdminReportsPage })));
// Proptech — agent pages
const AgentLeadsPage = lazy(() => import('@modules/proptech/agent/pages/agent-leads-page/agent-leads-page').then((m) => ({ default: m.AgentLeadsPage })));
const AgentClientsPage = lazy(() => import('@modules/proptech/agent/pages/agent-clients-page/agent-clients-page').then((m) => ({ default: m.AgentClientsPage })));
const AgentVisitsPage = lazy(() => import('@modules/proptech/agent/pages/agent-visits-page/agent-visits-page').then((m) => ({ default: m.AgentVisitsPage })));
const AgentSalesPage = lazy(() => import('@modules/proptech/agent/pages/agent-sales-page/agent-sales-page').then((m) => ({ default: m.AgentSalesPage })));
<<<<<<< HEAD
const AgentAutoPostPage = lazy(() => import('@modules/proptech/agent/pages/agent-auto-post-page/agent-auto-post-page').then((m) => ({ default: m.AgentAutoPostPage })));
const AgentsMarketplacePage = lazy(() => import('@modules/proptech/pages/agents-marketplace-page/agents-marketplace-page').then((m) => ({ default: m.AgentsMarketplacePage })));
const ClientProfilePage = lazy(() => import('@modules/proptech/client/pages/client-profile-page/client-profile-page').then((m) => ({ default: m.ClientProfilePage })));
const AgentLandValuationPage = lazy(() => import('@modules/property-valuations/pages/agent-land-valuation-page/agent-land-valuation-page').then((m) => ({ default: m.AgentLandValuationPage })));
const FinancialToolsPage = lazy(() => import('@modules/proptech/financial-tools/pages/financial-tools-page/financial-tools-page').then((m) => ({ default: m.FinancialToolsPage })));
=======
const AgentsMarketplacePage = lazy(() => import('@modules/proptech/pages/agents-marketplace-page/agents-marketplace-page').then((m) => ({ default: m.AgentsMarketplacePage })));
const ClientProfilePage = lazy(() => import('@modules/proptech/client/pages/client-profile-page/client-profile-page').then((m) => ({ default: m.ClientProfilePage })));
const AgentLandValuationPage = lazy(() => import('@modules/property-valuations/pages/agent-land-valuation-page/agent-land-valuation-page').then((m) => ({ default: m.AgentLandValuationPage })));
>>>>>>> origin/exp/pres

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

  // ── Proptech ─────────────────────────────────────────────────────────────
  { path: 'proptech', element: <ProptechDashboardRouter />, featureFlag: 'proptech' as FeatureFlagKey, permissions: [Permission.AccessProptech], roles: [Role.Admin, Role.Manager, Role.AgencyAdmin, Role.Agent, Role.Owner, Role.Client] },
  { path: 'proptech/profile', element: <ClientProfilePage />, featureFlag: 'proptech' as FeatureFlagKey, permissions: [Permission.AccessProptech], roles: [Role.Admin, Role.Manager, Role.AgencyAdmin, Role.Agent, Role.Owner, Role.Client] },

  // Proptech — properties
  { path: 'proptech/properties', element: <ProptechPropertiesRouter />, featureFlag: 'proptech' as FeatureFlagKey, permissions: [Permission.PropPropertyRead], roles: [Role.Admin, Role.Manager, Role.AgencyAdmin, Role.Agent, Role.Owner, Role.Viewer] },
  { path: 'proptech/properties/new', element: <PropertyCreatePage />, featureFlag: 'proptech' as FeatureFlagKey, permissions: [Permission.PropPropertyCreate], roles: [Role.Admin, Role.Manager, Role.AgencyAdmin, Role.Agent, Role.Owner] },

  // Proptech — agent CRM
  { path: 'proptech/leads', element: <AgentLeadsPage />, featureFlag: 'proptech' as FeatureFlagKey, permissions: [Permission.AccessCrm], roles: [Role.Admin, Role.Manager, Role.AgencyAdmin, Role.Agent] },
  { path: 'proptech/clients', element: <AgentClientsPage />, featureFlag: 'proptech' as FeatureFlagKey, permissions: [Permission.AccessProptech], roles: [Role.Admin, Role.Manager, Role.AgencyAdmin, Role.Agent] },
  { path: 'proptech/visits', element: <AgentVisitsPage />, featureFlag: 'proptech' as FeatureFlagKey, permissions: [Permission.AccessProptech], roles: [Role.Admin, Role.Manager, Role.AgencyAdmin, Role.Agent, Role.Owner, Role.Client] },

  // Proptech — AI matching & contracts
  { path: 'proptech/matching', element: <ProptechMatchingRouter />, featureFlag: 'proptech' as FeatureFlagKey, permissions: [Permission.PropMatchingGenerate], roles: [Role.Admin, Role.Manager, Role.AgencyAdmin, Role.Agent] },
  { path: 'proptech/valuations', element: <AgentLandValuationPage />, featureFlag: 'proptech' as FeatureFlagKey, permissions: [Permission.AccessProptech], roles: [Role.Admin, Role.Manager, Role.AgencyAdmin, Role.Agent, Role.Owner, Role.Client] },
  { path: 'proptech/contracts', element: <PropertyContractsPage />, featureFlag: 'proptech' as FeatureFlagKey, permissions: [Permission.PropContractReviewAi], roles: [Role.Admin, Role.Manager, Role.AgencyAdmin, Role.LegalReviewer] },

  // Proptech — analytics placeholder
  { path: 'proptech/analytics', element: <PropertyListPage />, featureFlag: 'proptech' as FeatureFlagKey, permissions: [Permission.PropMarketInsightsRead], roles: [Role.Admin, Role.Manager, Role.AgencyAdmin] },

  // Proptech — public search
  { path: 'proptech/search', element: <PublicPropertySearchPage />, featureFlag: 'proptech' as FeatureFlagKey, permissions: [], roles: [Role.Admin, Role.Manager, Role.AgencyAdmin, Role.Agent, Role.Owner, Role.Client, Role.Viewer] },

  // Proptech — admin sales & reports
  { path: 'proptech/sales', element: <AdminSalesPage />, featureFlag: 'proptech' as FeatureFlagKey, permissions: [Permission.AccessProptech], roles: [Role.Admin, Role.Manager, Role.AgencyAdmin] },
  { path: 'proptech/reports', element: <AdminReportsPage />, featureFlag: 'proptech' as FeatureFlagKey, permissions: [Permission.PropMarketInsightsRead], roles: [Role.Admin, Role.Manager, Role.AgencyAdmin] },

  // Proptech — agent sales
  { path: 'proptech/my-sales', element: <AgentSalesPage />, featureFlag: 'proptech' as FeatureFlagKey, permissions: [Permission.AccessProptech], roles: [Role.Agent] },

<<<<<<< HEAD
  // Proptech — agent auto post generator
  { path: 'proptech/auto-post', element: <AgentAutoPostPage />, featureFlag: 'proptech' as FeatureFlagKey, permissions: [Permission.AccessProptech], roles: [Role.Agent, Role.Admin, Role.AgencyAdmin] },

  // Proptech — owner agents marketplace
  { path: 'proptech/agents', element: <AgentsMarketplacePage />, featureFlag: 'proptech' as FeatureFlagKey, permissions: [Permission.AccessProptech], roles: [Role.Owner, Role.Admin] },
  
  // Proptech - financial tools
  { path: 'proptech/financial-tools', element: <FinancialToolsPage />, featureFlag: 'proptech' as FeatureFlagKey, permissions: [Permission.AccessProptech], roles: [Role.Admin, Role.Manager, Role.AgencyAdmin, Role.Agent, Role.Owner, Role.Client] },
=======
  // Proptech — owner agents marketplace
  { path: 'proptech/agents', element: <AgentsMarketplacePage />, featureFlag: 'proptech' as FeatureFlagKey, permissions: [Permission.AccessProptech], roles: [Role.Owner, Role.Admin] },
>>>>>>> origin/exp/pres
];
