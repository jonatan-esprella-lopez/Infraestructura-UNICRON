import type { AppConfig } from '../types/api.types.js';

export const appConfig: AppConfig = {
  apiPrefix: process.env.API_PREFIX ?? '/api/v1',
  corsOrigins: readList(process.env.CORS_ORIGINS ?? 'http://localhost:5173,http://127.0.0.1:5173'),
  env: process.env.NODE_ENV ?? 'development',
  host: process.env.API_HOST ?? '127.0.0.1',
  name: process.env.API_NAME ?? 'unicron-api',
  port: readNumber(process.env.API_PORT, 4000),
  rateLimit: {
    maxRequests: readNumber(process.env.RATE_LIMIT_MAX_REQUESTS, 120),
    windowMs: readNumber(process.env.RATE_LIMIT_WINDOW_MS, 60_000),
  },
  requestTimeoutMs: readNumber(process.env.REQUEST_TIMEOUT_MS, 30_000),
};

function readNumber(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function readList(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}
