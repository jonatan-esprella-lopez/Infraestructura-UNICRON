export type StoreMiddleware<TState> = (state: TState) => TState;

export function composeMiddleware<TState>(state: TState, middlewares: StoreMiddleware<TState>[]) {
  return middlewares.reduce((current, middleware) => middleware(current), state);
}
