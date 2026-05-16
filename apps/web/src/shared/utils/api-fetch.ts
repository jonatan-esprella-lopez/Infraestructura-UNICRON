import { environment } from '@bootstrap/environment';

export async function apiFetch(path: string, options?: RequestInit): Promise<Response> {
  const token = localStorage.getItem('intersim.token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return fetch(`${environment.apiBaseUrl}/v1${path}`, { ...options, headers });
}
