import { Role } from '@core/enums/roles.enum';

export const ROLE_LABELS: Record<Role, string> = {
  [Role.Admin]: 'Administrador',
  [Role.Manager]: 'Manager',
  [Role.Operator]: 'Operador',
  [Role.Viewer]: 'Viewer',
};
