import type { LoggerLike } from '../../core/types/api.types.js';

export class MapsService {
  constructor(private readonly logger: LoggerLike) {}

  async geocode(address: string): Promise<{ lat: number; lng: number }> {
    this.logger.info('Geocode requested', { address });
    return { lat: 0, lng: 0 };
  }
}
