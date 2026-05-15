import type { LoggerLike } from '../core/types/api.types.js';
import { DatabaseService } from '../infrastructure/database/database.service.js';

export async function bootstrapDatabase(logger: LoggerLike): Promise<DatabaseService> {
  const database = new DatabaseService(logger);
  await database.connect();
  return database;
}
