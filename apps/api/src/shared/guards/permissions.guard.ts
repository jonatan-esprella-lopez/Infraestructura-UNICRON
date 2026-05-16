import { PermissionError } from '../../core/errors/permission.error.js';
import type { RequestContext } from '../../core/types/api.types.js';

export function requirePermission(context: RequestContext, permissions: string[]): void {
  const hasPermission = context.user?.permissions.some((permission) => permissions.includes(permission));

  if (!hasPermission) {
    throw new PermissionError('Required permission is missing');
  }
}
