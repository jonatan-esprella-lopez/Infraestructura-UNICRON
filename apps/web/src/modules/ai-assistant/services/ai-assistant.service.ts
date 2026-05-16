import type { Service } from '@core/interfaces/service.interface';
import { aiassistantRepository } from '../repositories/ai-assistant.repository';

export const aiassistantService: Service = {
  name: 'ai-assistant',
  async initialize() {
    await aiassistantRepository.findAll();
  },
};
