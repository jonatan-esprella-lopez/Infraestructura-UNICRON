import type { Repository } from '../../../../core/interfaces/repository.interface.js';
import type { Lead, LeadSnapshot } from '../entities/lead.entity.js';

export interface CrmRepository extends Repository<Lead> {
  findAll(tenantId?: string): Promise<LeadSnapshot[]>;
}
