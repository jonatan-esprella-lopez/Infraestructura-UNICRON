import { randomUUID } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { AppError } from './core/errors/app.error.js';
import { ValidationError } from './core/errors/validation.error.js';
import { REQUEST_ID_HEADER, TENANT_ID_HEADER } from './core/constants/headers.constants.js';
import type {
  ApiResponse,
  AppConfig,
  AppServices,
  HttpMethod,
  Middleware,
  RequestContext,
  RouteDefinition,
} from './core/types/api.types.js';

export class ApiApplication {
  private readonly middlewares: Middleware[] = [];
  private readonly routes: RouteDefinition[] = [];

  constructor(
    private readonly config: AppConfig,
    private readonly services: AppServices,
  ) {}

  use(middleware: Middleware): void {
    this.middlewares.push(middleware);
  }

  register(route: RouteDefinition): void {
    this.routes.push(route);
  }

  registerMany(routes: RouteDefinition[]): void {
    routes.forEach((route) => this.register(route));
  }

  handle = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    const startedAt = Date.now();
    const requestId = String(req.headers[REQUEST_ID_HEADER] ?? randomUUID());
    const requestUrl = new URL(req.url ?? '/', `http://${req.headers.host ?? this.config.host}`);
    const method = normalizeMethod(req.method);
    const matched =
      method === 'OPTIONS'
        ? {
            params: {},
            route: {
              handler: () => ({ statusCode: 204, body: null }),
              method,
              path: requestUrl.pathname,
            },
          }
        : this.matchRoute(method, requestUrl.pathname);

    const context: RequestContext = {
      req,
      res,
      method,
      path: requestUrl.pathname,
      query: Object.fromEntries(requestUrl.searchParams.entries()),
      params: matched?.params ?? {},
      requestId,
      tenantId: req.headers[TENANT_ID_HEADER] ? String(req.headers[TENANT_ID_HEADER]) : undefined,
      startedAt,
      services: this.services,
    };

    try {
      if (!matched) {
        throw new AppError('Route not found', 404, 'ROUTE_NOT_FOUND');
      }

      context.body = await parseRequestBody(req);
      const response = await this.dispatch(context, matched.route.handler);

      if (!res.writableEnded) {
        sendJson(res, context, response ?? { statusCode: 204, body: null });
      }
    } catch (error) {
      this.handleError(error, context);
    }
  };

  private async dispatch(
    context: RequestContext,
    handler: RouteDefinition['handler'],
  ): Promise<ApiResponse | void> {
    let index = -1;

    const run = async (position: number): Promise<ApiResponse | void> => {
      if (position <= index) {
        throw new AppError('Middleware chain called multiple times', 500, 'MIDDLEWARE_CHAIN_ERROR');
      }

      index = position;
      const middleware = this.middlewares[position];

      if (middleware) {
        return middleware(context, () => run(position + 1));
      }

      return handler(context);
    };

    return run(0);
  }

  private matchRoute(method: HttpMethod, path: string): { route: RouteDefinition; params: Record<string, string> } | null {
    for (const route of this.routes) {
      if (route.method !== method) {
        continue;
      }

      const params = matchPath(route.path, path);

      if (params) {
        return { route, params };
      }
    }

    return null;
  }

  private handleError(error: unknown, context: RequestContext): void {
    const appError =
      error instanceof AppError
        ? error
        : new AppError('Unexpected server error', 500, 'INTERNAL_SERVER_ERROR', { cause: String(error) });

    context.services.logger.error(appError.message, {
      code: appError.code,
      requestId: context.requestId,
      path: context.path,
      method: context.method,
      details: appError.details,
    });

    sendJson(context.res, context, {
      statusCode: appError.statusCode,
      body: {
        error: {
          code: appError.code,
          message: appError.message,
          details: appError.details,
        },
        requestId: context.requestId,
      },
    });
  }
}

function normalizeMethod(method?: string): HttpMethod {
  const value = (method ?? 'GET').toUpperCase();

  if (['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'].includes(value)) {
    return value as HttpMethod;
  }

  return 'GET';
}

function matchPath(pattern: string, path: string): Record<string, string> | null {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = path.split('/').filter(Boolean);

  if (patternParts.length !== pathParts.length) {
    return null;
  }

  return patternParts.reduce<Record<string, string> | null>((params, segment, index) => {
    if (!params) {
      return null;
    }

    const current = pathParts[index];

    if (segment.startsWith(':')) {
      params[segment.slice(1)] = decodeURIComponent(current);
      return params;
    }

    return segment === current ? params : null;
  }, {});
}

async function parseRequestBody(req: IncomingMessage): Promise<unknown> {
  if (!['POST', 'PUT', 'PATCH'].includes(req.method?.toUpperCase() ?? '')) {
    return undefined;
  }

  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  if (chunks.length === 0) {
    return undefined;
  }

  const raw = Buffer.concat(chunks).toString('utf8').trim();

  if (!raw) {
    return undefined;
  }

  try {
    return JSON.parse(raw) as unknown;
  } catch {
    throw new ValidationError('Request body must be valid JSON');
  }
}

function sendJson(res: ServerResponse, context: RequestContext, response: ApiResponse): void {
  const statusCode = response.statusCode ?? 200;

  res.statusCode = statusCode;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader(REQUEST_ID_HEADER, context.requestId);

  Object.entries(response.headers ?? {}).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (statusCode === 204) {
    res.end();
    return;
  }

  res.end(JSON.stringify(response.body));
}
