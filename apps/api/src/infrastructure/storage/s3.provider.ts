import type { ProviderPort } from '../../core/interfaces/provider.interface.js';

export class S3Provider implements ProviderPort {
  readonly name = 's3';

  isConfigured(): boolean {
    return Boolean(process.env.AWS_S3_BUCKET);
  }
}
