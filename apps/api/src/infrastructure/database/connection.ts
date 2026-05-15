import { databaseConfig } from '../../core/config/database.config.js';

export function getDatabaseConnectionInfo() {
  return {
    configured: Boolean(databaseConfig.url),
    provider: databaseConfig.provider,
  };
}
