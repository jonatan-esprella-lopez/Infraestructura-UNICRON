export type RequestInterceptor = (request: RequestInit) => RequestInit;
export type ResponseInterceptor<TData> = (response: TData) => TData;
