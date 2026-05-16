import { createServer as createHttpServer, type Server } from 'node:http';
import type { ApiApplication } from './app.js';
import type { AppConfig, LoggerLike } from './core/types/api.types.js';

export interface ApiRuntime {
  close(signal?: string): Promise<void>;
  listen(): Promise<void>;
  server: Server;
}

export function createServer(app: ApiApplication, config: AppConfig, logger: LoggerLike): ApiRuntime {
  const server = createHttpServer(app.handle);

  return {
    server,
    listen: () =>
      new Promise<void>((resolve) => {
        server.listen(config.port, config.host, () => {
          logger.info(`API listening on http://${config.host}:${config.port}`);
          resolve();
        });
      }),
    close: (signal?: string) =>
      new Promise<void>((resolve) => {
        logger.info('API shutdown requested', { signal });
        server.close(() => resolve());
      }),
  };
}
