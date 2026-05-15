import { useMemo } from 'react';
import { WORKFLOWS_MODULE } from '../constants/workflows.constants';

export function useWorkflows() {
  return useMemo(
    () => ({
      module: WORKFLOWS_MODULE,
      isReady: true,
    }),
    [],
  );
}
