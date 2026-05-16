import { Role } from '@core/enums/roles.enum';
import { useRootStore } from '@store/root-store';
import { AgentMatchingPage } from '@modules/proptech/agent/pages/agent-matching-page/agent-matching-page';
import { PropertyMatchingPage } from '@modules/proptech/pages/property-matching-page/property-matching-page';

export function ProptechMatchingRouter() {
  const { currentUser } = useRootStore();
  if (currentUser.roles.includes(Role.Agent)) {
    return <AgentMatchingPage />;
  }
  return <PropertyMatchingPage />;
}
