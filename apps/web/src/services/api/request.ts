import { apiConfig } from '@core/config/api.config';

export async function request<TData>(path: string, init?: RequestInit): Promise<TData> {
  const response = await fetch(`${apiConfig.baseUrl}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<TData>;
}
