import type { AuthenticatedUser, Middleware } from '../../core/types/api.types.js';

export const authMiddleware: Middleware = (context, next) => {
  const authHeader = context.req.headers['authorization'];
  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8')) as AuthenticatedUser;
      if (decoded?.id) {
        context.user = decoded;
      }
    } catch {
      // invalid token — ctx.user remains undefined
    }
  }
  return next();
};
