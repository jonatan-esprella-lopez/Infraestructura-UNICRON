import { useMemo } from 'react';
import { DOCUMENTS_MODULE } from '../constants/documents.constants';

export function useDocuments() {
  return useMemo(
    () => ({
      module: DOCUMENTS_MODULE,
      isReady: true,
    }),
    [],
  );
}
