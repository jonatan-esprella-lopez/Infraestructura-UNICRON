import type { Repository } from '@core/interfaces/repository.interface';
import type { AiAssistantItem } from '../types/ai-assistant.types';

const seedItems: AiAssistantItem[] = [
  { id: 'ai-assistant-1', name: 'AI Assistant operativo', status: 'active', owner: 'Growth Team' },
  { id: 'ai-assistant-2', name: 'AI Assistant discovery', status: 'draft', owner: 'Product Team' },
];

export const aiassistantRepository: Repository<AiAssistantItem> = {
  async findAll() {
    return seedItems;
  },
  async findById(id) {
    return seedItems.find((item) => item.id === id) ?? null;
  },
};
