import { TursoService } from '../infrastructure/database/turso/turso.service.js';
import { runMigrations } from '../infrastructure/database/turso/migrate.js';
import type { LoggerLike } from '../core/types/api.types.js';

export async function bootstrapTurso(logger: LoggerLike): Promise<TursoService | null> {
  const url = process.env['TURSO_DATABASE_URL'] || process.env['DATABASE_URL'] || 'file:./local.db';
  const authToken = process.env['TURSO_AUTH_TOKEN'] || '';

  const isRemote = !url.startsWith('file:');
  if (isRemote && !authToken) {
    logger.warn('Turso remote URL requires TURSO_AUTH_TOKEN — falling back to local.db.');
  }

  try {
    const turso = new TursoService(logger);
    await turso.connect(url, authToken);
    await runMigrations(turso);
    logger.info(`Turso connected: ${url}`);
    return turso;
  } catch (err) {
    logger.error('Turso connection failed — using in-memory repositories.', { err });
    return null;
  }
}
