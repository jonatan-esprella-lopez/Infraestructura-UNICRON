import type { ProviderPort } from '../../core/interfaces/provider.interface.js';

export class AnthropicProvider implements ProviderPort {
  readonly name = 'anthropic';

  isConfigured(): boolean {
    return Boolean(process.env.ANTHROPIC_API_KEY);
  }
}
