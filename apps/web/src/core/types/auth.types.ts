import type { Permission } from '@core/enums/permissions.enum';
import type { Role } from '@core/enums/roles.enum';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  roles: Role[];
  permissions: Permission[];
  tenantId?: string;
}
