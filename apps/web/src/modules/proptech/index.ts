// Shared
export * from './shared/types/index';
export * from './shared/services/index';
export * from './shared/hooks/index';

// Role-based dashboards
export { AdminDashboardPage } from './admin/pages/admin-dashboard-page/admin-dashboard-page';
export { AdminSalesPage } from './admin/pages/admin-sales-page/admin-sales-page';
export { AdminReportsPage } from './admin/pages/admin-reports-page/admin-reports-page';
export { AgentDashboardPage } from './agent/pages/agent-dashboard-page/agent-dashboard-page';
export { AgentSalesPage } from './agent/pages/agent-sales-page/agent-sales-page';
export { OwnerDashboardPage } from './owner/pages/owner-dashboard-page/owner-dashboard-page';
export { ClientDashboardPage } from './client/pages/client-dashboard-page/client-dashboard-page';
export { ProptechDashboardRouter } from './shared/components/proptech-dashboard-router/proptech-dashboard-router';

// Shared pages (kept for backward compatibility)
export { PropertyDashboardPage } from './pages/property-dashboard-page/property-dashboard-page';
export { PropertyListPage } from './pages/property-list-page/property-list-page';
export { PropertyMatchingPage } from './pages/property-matching-page/property-matching-page';
export { PropertyContractsPage } from './pages/property-contracts-page/property-contracts-page';

// Public
export { PublicPropertySearchPage } from './public/pages/public-property-search-page/public-property-search-page';
