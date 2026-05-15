import type { RequestContext } from '../../core/types/api.types.js';

export function currentUser(context: RequestContext) {
  return context.user;
}
