import type { Middleware } from '../../core/types/api.types.js';
import { REQUEST_ID_HEADER } from '../../core/constants/headers.constants.js';

export const requestIdMiddleware: Middleware = (context, next) => {
  context.res.setHeader(REQUEST_ID_HEADER, context.requestId);
  return next();
};
