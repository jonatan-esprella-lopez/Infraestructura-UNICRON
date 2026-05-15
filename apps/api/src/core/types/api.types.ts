import type { IncomingMessage, ServerResponse } from 'node:http';
import type { EventHandler } from '../interfaces/event-handler.interface.js';
import type { ModuleName } from '../enums/module.enum.js';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';

export interface AppConfig {
  apiPrefix: string;
  corsOrigins: string[];
  env: string;
  host: string;
  name: string;
  port: number;
  rateLimit: {
    maxRequests: number;
    windowMs: number;
  };
  requestTimeoutMs: number;
}

export interface LoggerLike {
  audit(message: string, context?: Record<string, unknown>): void;
  debug(message: string, context?: Record<string, unknown>): void;
  error(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
}

export interface CacheLike {
  delete(key: string): Promise<void>;
  get<T>(key: string): Promise<T | null>;
  isReady(): boolean;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
}

export interface DatabaseLike {
  connect(): Promise<void>;
  isReady(): boolean;
  transaction<T>(work: () => Promise<T>): Promise<T>;
}

export interface QueueLike {
  enqueue<T>(queueName: string, payload: T): Promise<void>;
  isReady(): boolean;
}

export interface MetricsLike {
  increment(name: string, labels?: Record<string, string>): void;
  observe(name: string, value: number, labels?: Record<string, string>): void;
  snapshot(): Record<string, unknown>;
}

export interface EventBusLike {
  publish<TPayload>(event: DomainEvent<TPayload>): Promise<void>;
  subscribe<TPayload>(eventName: string, handler: (event: DomainEvent<TPayload>) => Promise<void> | void): void;
}

export interface AiProviderLike {
  classifyIntent(input: { text: string; tenantId?: string }): Promise<{ intent: string; confidence: number }>;
  generate(input: { prompt: string; tenantId?: string }): Promise<{ text: string }>;
}

export interface HealthcheckLike {
  health(): Promise<Record<string, unknown>>;
  ready(): Promise<Record<string, unknown>>;
}

export interface MailLike {
  send(input: { to: string; subject: string; template: string; data?: Record<string, unknown> }): Promise<void>;
}

export interface StorageLike {
  putObject(input: { key: string; body: Buffer | string; contentType?: string }): Promise<{ key: string }>;
}

export interface AppServices {
  ai: AiProviderLike;
  cache: CacheLike;
  database: DatabaseLike;
  eventBus: EventBusLike;
  healthcheck: HealthcheckLike;
  logger: LoggerLike;
  mail: MailLike;
  metrics: MetricsLike;
  queue: QueueLike;
  storage: StorageLike;
}

export interface RequestContext {
  body?: unknown;
  method: HttpMethod;
  params: Record<string, string>;
  path: string;
  query: Record<string, string>;
  req: IncomingMessage;
  requestId: string;
  res: ServerResponse;
  services: AppServices;
  startedAt: number;
  tenantId?: string;
  user?: AuthenticatedUser;
}

export interface AuthenticatedUser {
  id: string;
  permissions: string[];
  roles: string[];
  tenantId?: string;
}

export interface ApiResponse<TBody = unknown> {
  body: TBody;
  headers?: Record<string, string>;
  statusCode?: number;
}

export type NextFunction = () => Promise<ApiResponse | void>;
export type Middleware = (context: RequestContext, next: NextFunction) => Promise<ApiResponse | void> | ApiResponse | void;
export type RouteHandler = (context: RequestContext) => Promise<ApiResponse | void> | ApiResponse | void;

export interface RouteDefinition {
  handler: RouteHandler;
  method: HttpMethod;
  path: string;
  public?: boolean;
}

export interface DomainEvent<TPayload = Record<string, unknown>> {
  id: string;
  metadata: EventMetadata;
  name: string;
  occurredAt: string;
  payload: TPayload;
}

export interface EventMetadata {
  correlationId?: string;
  requestId?: string;
  tenantId?: string;
}

export interface ApplicationModule {
  basePath: string;
  listeners?: EventHandler[];
  name: ModuleName;
  routes: RouteDefinition[];
}
