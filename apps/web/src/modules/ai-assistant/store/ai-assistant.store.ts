import type { AiAssistantItem } from '../types/ai-assistant.types';

export interface AiAssistantState {
  items: AiAssistantItem[];
  selectedId: string | null;
}

export const initialAiAssistantState: AiAssistantState = {
  items: [],
  selectedId: null,
};
