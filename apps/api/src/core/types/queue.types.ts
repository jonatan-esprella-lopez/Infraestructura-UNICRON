export interface QueueJob<TPayload = Record<string, unknown>> {
  attempts: number;
  id: string;
  name: string;
  payload: TPayload;
  queuedAt: string;
}

export type QueueProcessor<TPayload = Record<string, unknown>> = (job: QueueJob<TPayload>) => Promise<void>;
