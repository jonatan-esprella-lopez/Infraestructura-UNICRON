import type { ApiResponse } from '../../core/types/api.types.js';

export function ok<TBody>(body: TBody): ApiResponse<TBody> {
  return { body, statusCode: 200 };
}

export function created<TBody>(body: TBody): ApiResponse<TBody> {
  return { body, statusCode: 201 };
}

export function noContent(): ApiResponse<null> {
  return { body: null, statusCode: 204 };
}
