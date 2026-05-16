import { createClient, type Client, type ResultSet, type InValue } from '@libsql/client';
import type { LoggerLike } from '../../../core/types/api.types.js';

export class TursoService {
  private client!: Client;
  private ready = false;

  constructor(private readonly logger: LoggerLike) {}

  async connect(url: string, authToken: string): Promise<void> {
    this.client = createClient({ url, authToken });
    // Smoke test
    await this.client.execute('SELECT 1');
    this.ready = true;
    this.logger.info('Turso database connected', { url });
  }

  isReady(): boolean {
    return this.ready;
  }

  async execute(sql: string, args?: Record<string, unknown>): Promise<ResultSet> {
    return this.client.execute({ sql, args: (args ?? {}) as Record<string, InValue> });
  }

  async batch(statements: Array<{ sql: string; args?: Record<string, unknown> }>): Promise<ResultSet[]> {
    return this.client.batch(
      statements.map((s) => ({ sql: s.sql, args: (s.args ?? {}) as Record<string, InValue> })),
      'write',
    );
  }

  getClient(): Client {
    return this.client;
  }
}
