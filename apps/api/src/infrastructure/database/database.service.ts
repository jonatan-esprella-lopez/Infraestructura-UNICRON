import type { DatabaseLike, LoggerLike } from '../../core/types/api.types.js';
import { getDatabaseConnectionInfo } from './connection.js';
import { runTransaction } from './transaction.js';

export class DatabaseService implements DatabaseLike {
  private ready = false;

  constructor(private readonly logger: LoggerLike) {}

  async connect(): Promise<void> {
    const connectionInfo = getDatabaseConnectionInfo();
    this.ready = true;
    this.logger.info('Database service initialized', connectionInfo);
  }

  isReady(): boolean {
    return this.ready;
  }

  async transaction<T>(work: () => Promise<T>): Promise<T> {
    return runTransaction(work);
  }
}
