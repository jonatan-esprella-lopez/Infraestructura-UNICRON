import { API_KEY_HEADER } from '../../core/constants/headers.constants.js';
import { AuthError } from '../../core/errors/auth.error.js';
import type { RequestContext } from '../../core/types/api.types.js';

export function requireApiKey(context: RequestContext): void {
  const expected = process.env.INTEGRATION_API_KEY;

  if (!expected || context.req.headers[API_KEY_HEADER] !== expected) {
    throw new AuthError('Valid API key required');
  }
}
