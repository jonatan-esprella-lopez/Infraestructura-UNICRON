import type { TursoService } from './turso.service.js';
import { SCHEMA_SQL } from './schema.sql.js';

export async function runMigrations(db: TursoService): Promise<void> {
  const statements = SCHEMA_SQL
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s) => ({ sql: s + ';' }));

  await db.batch(statements);
}
