import { environment } from '@bootstrap/environment';
import type { PropertyContract, ContractAiReview } from '../types/property-contract.types';

const BASE = `${environment.apiBaseUrl}/v1/proptech`;

export const propertyContractService = {
  async findByProperty(propertyId: string): Promise<PropertyContract[]> {
    const res = await fetch(`${BASE}/properties/${propertyId}/contracts`);
    if (!res.ok) throw new Error('Error al obtener contratos');
    return res.json() as Promise<PropertyContract[]>;
  },

  async findById(id: string): Promise<PropertyContract> {
    const res = await fetch(`${BASE}/contracts/${id}`);
    if (!res.ok) throw new Error('Contrato no encontrado');
    return res.json() as Promise<PropertyContract>;
  },

  async create(data: Partial<PropertyContract>): Promise<PropertyContract> {
    const res = await fetch(`${BASE}/contracts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al crear contrato');
    return res.json() as Promise<PropertyContract>;
  },

  async reviewWithAi(id: string): Promise<ContractAiReview> {
    const res = await fetch(`${BASE}/contracts/${id}/review-ai`, { method: 'POST' });
    if (!res.ok) throw new Error('Error al revisar contrato con IA');
    return res.json() as Promise<ContractAiReview>;
  },
};
