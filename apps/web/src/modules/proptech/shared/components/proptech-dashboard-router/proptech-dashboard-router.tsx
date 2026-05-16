import { usePermissions } from '@shared/hooks/usePermissions';
import { Role } from '@core/enums/roles.enum';
import { AdminDashboardPage } from '../../../admin/pages/admin-dashboard-page/admin-dashboard-page';
import { AgentDashboardPage } from '../../../agent/pages/agent-dashboard-page/agent-dashboard-page';
import { OwnerDashboardPage } from '../../../owner/pages/owner-dashboard-page/owner-dashboard-page';
import { ClientDashboardPage } from '../../../client/pages/client-dashboard-page/client-dashboard-page';

export function ProptechDashboardRouter() {
  const { currentUser } = usePermissions();
  const roles = currentUser.roles;

  if (roles.includes(Role.Admin) || roles.includes(Role.Manager) || roles.includes(Role.AgencyAdmin)) {
    return <AdminDashboardPage />;
  }

  if (roles.includes(Role.Agent)) {
    return <AgentDashboardPage />;
  }

  if (roles.includes(Role.Owner)) {
    return <OwnerDashboardPage />;
  }

  if (roles.includes(Role.Client)) {
    return <ClientDashboardPage />;
  }

  return <AdminDashboardPage />;
}
