import { environment } from '@bootstrap/environment';

export const apiConfig = {
  baseUrl: environment.apiBaseUrl,
  timeoutMs: 30_000,
  retries: 1,
} as const;
