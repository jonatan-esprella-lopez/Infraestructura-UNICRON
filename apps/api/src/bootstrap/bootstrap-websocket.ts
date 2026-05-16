import type { AppServices } from '../core/types/api.types.js';
import { SocketGateway } from '../infrastructure/websocket/socket.gateway.js';

export function bootstrapWebsocket(services: AppServices): SocketGateway {
  return new SocketGateway(services.logger);
}
