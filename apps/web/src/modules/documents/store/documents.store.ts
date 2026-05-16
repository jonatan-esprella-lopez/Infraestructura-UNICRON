import type { DocumentsItem } from '../types/documents.types';

export interface DocumentsState {
  items: DocumentsItem[];
  selectedId: string | null;
}

export const initialDocumentsState: DocumentsState = {
  items: [],
  selectedId: null,
};
