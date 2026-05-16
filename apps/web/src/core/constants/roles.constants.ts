import { Role } from '@core/enums/roles.enum';

export const ROLE_LABELS: Record<Role, string> = {
  [Role.Admin]: 'Administrador',
  [Role.Manager]: 'Manager',
  [Role.Operator]: 'Operador',
  [Role.Viewer]: 'Viewer',
  [Role.AgencyAdmin]: 'Admin de agencia',
  [Role.Agent]: 'Agente inmobiliario',
  [Role.Owner]: 'Propietario',
  [Role.Client]: 'Cliente',
  [Role.LegalReviewer]: 'Revisor legal',
};
