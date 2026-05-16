import type { LoggerLike } from '../../core/types/api.types.js';

export class AuditLogger {
  constructor(private readonly logger: LoggerLike) {}

  record(action: string, context: Record<string, unknown>): void {
    this.logger.audit(action, context);
  }
}
