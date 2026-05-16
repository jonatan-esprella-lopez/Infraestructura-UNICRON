import { crmRepository } from '../repositories/crm.repository';

export const crmService = {
  getLeads() {
    return crmRepository.findAll();
  },
};
