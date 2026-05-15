import type { ProviderPort } from '../../core/interfaces/provider.interface.js';

export class GeminiProvider implements ProviderPort {
  readonly name = 'gemini';

  isConfigured(): boolean {
    return Boolean(process.env.GEMINI_API_KEY);
  }
}
