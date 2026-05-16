import { PermissionError } from '../../core/errors/permission.error.js';
import type { RequestContext } from '../../core/types/api.types.js';

export function requireRole(context: RequestContext, roles: string[]): void {
  const hasRole = context.user?.roles.some((role) => roles.includes(role));

  if (!hasRole) {
    throw new PermissionError('Required role is missing');
  }
}
