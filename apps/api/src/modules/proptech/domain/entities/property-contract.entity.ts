export type ContractType = 'alquiler' | 'anticretico' | 'compra_venta' | 'reserva' | 'opcion_compra';
export type ContractStatus = 'draft' | 'under_review' | 'signed' | 'active' | 'terminated' | 'expired';

export interface PropertyContract {
  id: string;
  propertyId: string;
  clientId: string;
  ownerId: string;
  agentId?: string;
  contractType: ContractType;
  status: ContractStatus;
  fileUrl?: string;
  draftText?: string;
  totalAmount: number;
  currency: string;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
