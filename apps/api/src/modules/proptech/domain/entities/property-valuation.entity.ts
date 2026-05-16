export type ValuationMethod = 'comparative' | 'income' | 'cost' | 'ai_estimated';

export interface PropertyValuation {
  id: string;
  propertyId: string;
  estimatedValue: number;
  currency: string;
  method: ValuationMethod;
  valuatedBy?: string;
  notes?: string;
  validUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}
