import type { DocumentsItem } from '../types/documents.types';

export const documentsActions = {
  select(id: string) {
    return { type: 'documents/select', payload: id } as const;
  },
  hydrate(items: DocumentsItem[]) {
    return { type: 'documents/hydrate', payload: items } as const;
  },
};
