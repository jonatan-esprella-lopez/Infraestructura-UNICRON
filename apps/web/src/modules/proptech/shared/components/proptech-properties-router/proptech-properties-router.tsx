import { Role } from '@core/enums/roles.enum';
import { usePermissions } from '@shared/hooks/usePermissions';
import { OwnerPropertiesPage } from '../../../owner/pages/owner-properties-page/owner-properties-page';
import { PropertyListPage } from '../../../pages/property-list-page/property-list-page';

export function ProptechPropertiesRouter() {
  const { currentUser } = usePermissions();

  if (currentUser.roles.includes(Role.Owner)) {
    return <OwnerPropertiesPage />;
  }

  return <PropertyListPage />;
}
