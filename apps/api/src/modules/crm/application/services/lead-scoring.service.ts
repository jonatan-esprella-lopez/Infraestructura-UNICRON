import { LeadScore } from '../../domain/value-objects/lead-score.vo.js';
import type { CreateLeadDto } from '../dto/create-lead.dto.js';

export class LeadScoringService {
  score(input: CreateLeadDto): LeadScore {
    let value = 35;

    if (input.email) {
      value += 20;
    }

    if (input.phone) {
      value += 15;
    }

    if ((input.source ?? '').toLowerCase().includes('campaign')) {
      value += 20;
    }

    return LeadScore.create(Math.min(value, 100));
  }
}
