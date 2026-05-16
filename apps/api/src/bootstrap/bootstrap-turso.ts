import { TursoService } from '../infrastructure/database/turso/turso.service.js';
import { runMigrations } from '../infrastructure/database/turso/migrate.js';
import type { LoggerLike } from '../core/types/api.types.js';

export async function bootstrapTurso(logger: LoggerLike): Promise<TursoService | null> {
  const url = process.env['TURSO_DATABASE_URL'];
  const authToken = process.env['TURSO_AUTH_TOKEN'];

  if (!url || !authToken) {
    logger.warn('Turso not configured — using in-memory repositories. Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN to enable persistence.');
    return null;
  }

  const turso = new TursoService(logger);
  await turso.connect(url, authToken);
  await runMigrations(turso);
  logger.info('Turso migrations applied');
  return turso;
}
