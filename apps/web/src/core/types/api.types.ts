export interface ApiResponse<TData> {
  data: TData;
  message?: string;
  meta?: Record<string, unknown>;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
