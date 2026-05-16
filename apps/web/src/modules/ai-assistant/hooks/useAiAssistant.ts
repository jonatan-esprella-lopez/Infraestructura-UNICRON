import { useMemo } from 'react';
import { AIASSISTANT_MODULE } from '../constants/ai-assistant.constants';

export function useAiAssistant() {
  return useMemo(
    () => ({
      module: AIASSISTANT_MODULE,
      isReady: true,
    }),
    [],
  );
}
