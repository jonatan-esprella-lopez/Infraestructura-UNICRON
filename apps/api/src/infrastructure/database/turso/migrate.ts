import type { TursoService } from './turso.service.js';
import { SCHEMA_SQL } from './schema.sql.js';

const ALTER_STATEMENTS = [
  `ALTER TABLE property_visits ADD COLUMN visit_type TEXT NOT NULL DEFAULT 'in_person'`,
  `ALTER TABLE property_visits ADD COLUMN result TEXT`,
  `ALTER TABLE property_visits ADD COLUMN agent_feedback TEXT`,
];

export async function runMigrations(db: TursoService): Promise<void> {
  const statements = SCHEMA_SQL
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s) => ({ sql: s + ';' }));

  await db.batch(statements);

  for (const sql of ALTER_STATEMENTS) {
    try {
      await db.execute(sql);
    } catch {
      // Column already exists — safe to ignore
    }
  }
}
