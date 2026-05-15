import type { ApiResponse } from '@core/types/api.types';

export function unwrapResponse<TData>(response: ApiResponse<TData>) {
  return response.data;
}
