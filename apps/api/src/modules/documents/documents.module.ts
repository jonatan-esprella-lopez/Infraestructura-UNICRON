import { ModuleName } from '../../core/enums/module.enum.js';
import type { AppServices } from '../../core/types/api.types.js';
import { createFeatureModule } from '../_shared/feature-module.factory.js';

export function createDocumentsModule(services: AppServices) {
  return createFeatureModule(
    {
      basePath: '/documents',
      capabilities: ['upload', 'ocr-ready', 'metadata', 'storage-provider'],
      description: 'Document ingestion and processing boundary.',
      name: ModuleName.Documents,
    },
    services,
  );
}
