import type { ProviderPort } from '../../core/interfaces/provider.interface.js';

export class OcrProvider implements ProviderPort {
  readonly name = 'ocr';

  isConfigured(): boolean {
    return Boolean(process.env.OCR_PROVIDER);
  }
}
