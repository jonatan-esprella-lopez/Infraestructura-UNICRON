import type { Repository } from '@core/interfaces/repository.interface';
import type { DocumentsItem } from '../types/documents.types';

const seedItems: DocumentsItem[] = [
  { id: 'documents-1', name: 'Documents operativo', status: 'active', owner: 'Growth Team' },
  { id: 'documents-2', name: 'Documents discovery', status: 'draft', owner: 'Product Team' },
];

export const documentsRepository: Repository<DocumentsItem> = {
  async findAll() {
    return seedItems;
  },
  async findById(id) {
    return seedItems.find((item) => item.id === id) ?? null;
  },
};
