import type { LoggerLike } from '../../core/types/api.types.js';

export class SocketService {
  constructor(private readonly logger: LoggerLike) {}

  broadcast(event: string, payload: Record<string, unknown>): void {
    this.logger.debug('Socket broadcast skipped in memory mode', { event, payload });
  }
}
