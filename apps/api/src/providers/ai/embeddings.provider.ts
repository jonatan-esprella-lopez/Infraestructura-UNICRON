import type { ProviderPort } from '../../core/interfaces/provider.interface.js';

export class EmbeddingsProvider implements ProviderPort {
  readonly name = 'embeddings';

  isConfigured(): boolean {
    return Boolean(process.env.OPENAI_API_KEY);
  }
}
