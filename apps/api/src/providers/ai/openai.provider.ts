import type { AiProviderLike } from '../../core/types/api.types.js';

export class OpenAiProvider implements AiProviderLike {
  async classifyIntent(input: { text: string; tenantId?: string }): Promise<{ intent: string; confidence: number }> {
    const normalized = input.text.toLowerCase();

    if (normalized.includes('price') || normalized.includes('precio') || normalized.includes('cotizacion')) {
      return { confidence: 0.82, intent: 'commercial_interest' };
    }

    if (normalized.includes('support') || normalized.includes('ayuda')) {
      return { confidence: 0.78, intent: 'support_request' };
    }

    return { confidence: 0.62, intent: 'general_interest' };
  }

  async generate(input: { prompt: string; tenantId?: string }): Promise<{ text: string }> {
    return { text: `Draft response for: ${input.prompt}` };
  }
}
