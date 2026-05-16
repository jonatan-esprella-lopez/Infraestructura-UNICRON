import type { ApiResponse } from '../../core/types/api.types.js';

export function ok<TBody>(body: TBody): ApiResponse<{ data: TBody }> {
  return { body: { data: body }, statusCode: 200 };
}

export function created<TBody>(body: TBody): ApiResponse<{ data: TBody }> {
  return { body: { data: body }, statusCode: 201 };
}

export function noContent(): ApiResponse<null> {
  return { body: null, statusCode: 204 };
}

export function notFound(message = 'Not found'): ApiResponse<{ error: string }> {
  return { body: { error: message }, statusCode: 404 };
}

export function badRequest(message = 'Bad request'): ApiResponse<{ error: string }> {
  return { body: { error: message }, statusCode: 400 };
}
