export type ContractType = 'alquiler' | 'anticretico' | 'compra_venta' | 'reserva' | 'opcion_compra';
export type ContractStatus = 'draft' | 'under_review' | 'signed' | 'active' | 'terminated' | 'expired';
export type ContractRiskLevel = 'low' | 'medium' | 'high';

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
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContractAiReview {
  riskLevel: ContractRiskLevel;
  summary: string;
  missingFields: string[];
  detectedClauses: string[];
  warnings: string[];
  recommendations: string[];
  disclaimer: string;
}
