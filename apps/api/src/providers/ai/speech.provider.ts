import type { ProviderPort } from '../../core/interfaces/provider.interface.js';

export class SpeechProvider implements ProviderPort {
  readonly name = 'speech';

  isConfigured(): boolean {
    return Boolean(process.env.OPENAI_API_KEY);
  }
}
