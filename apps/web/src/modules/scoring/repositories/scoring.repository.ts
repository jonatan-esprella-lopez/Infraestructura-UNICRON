import type { Repository } from '@core/interfaces/repository.interface';
import type { ScoringItem } from '../types/scoring.types';

const seedItems: ScoringItem[] = [
  { id: 'scoring-1', name: 'Scoring operativo', status: 'active', owner: 'Growth Team' },
  { id: 'scoring-2', name: 'Scoring discovery', status: 'draft', owner: 'Product Team' },
];

export const scoringRepository: Repository<ScoringItem> = {
  async findAll() {
    return seedItems;
  },
  async findById(id) {
    return seedItems.find((item) => item.id === id) ?? null;
  },
};
