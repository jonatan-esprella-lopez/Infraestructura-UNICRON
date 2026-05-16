import type { LoggerLike } from '../../core/types/api.types.js';
import { SocketService } from './socket.service.js';

export class SocketGateway {
  readonly service: SocketService;

  constructor(logger: LoggerLike) {
    this.service = new SocketService(logger);
    logger.info('Websocket gateway initialized', { driver: 'placeholder' });
  }
}
