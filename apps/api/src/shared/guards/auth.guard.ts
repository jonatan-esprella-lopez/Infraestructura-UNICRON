import { AuthError } from '../../core/errors/auth.error.js';
import type { RequestContext } from '../../core/types/api.types.js';

export function requireAuth(context: RequestContext): void {
  if (!context.user) {
    throw new AuthError();
  }
}
