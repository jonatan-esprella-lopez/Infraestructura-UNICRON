import { randomUUID } from 'node:crypto';

export class TracingService {
  createTraceId(): string {
    return randomUUID();
  }
}
