import type { AiAssistantItem } from '../types/ai-assistant.types';

export const aiassistantActions = {
  select(id: string) {
    return { type: 'ai-assistant/select', payload: id } as const;
  },
  hydrate(items: AiAssistantItem[]) {
    return { type: 'ai-assistant/hydrate', payload: items } as const;
  },
};
