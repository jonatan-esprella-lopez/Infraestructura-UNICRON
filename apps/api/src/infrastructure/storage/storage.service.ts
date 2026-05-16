import type { LoggerLike, StorageLike } from '../../core/types/api.types.js';

export class StorageService implements StorageLike {
  constructor(private readonly logger: LoggerLike) {}

  async putObject(input: { key: string; body: Buffer | string; contentType?: string }): Promise<{ key: string }> {
    this.logger.info('Object stored', {
      contentType: input.contentType,
      key: input.key,
      size: typeof input.body === 'string' ? input.body.length : input.body.byteLength,
    });

    return { key: input.key };
  }
}
