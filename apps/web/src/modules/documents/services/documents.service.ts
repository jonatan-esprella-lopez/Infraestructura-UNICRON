import type { Service } from '@core/interfaces/service.interface';
import { documentsRepository } from '../repositories/documents.repository';

export const documentsService: Service = {
  name: 'documents',
  async initialize() {
    await documentsRepository.findAll();
  },
};
