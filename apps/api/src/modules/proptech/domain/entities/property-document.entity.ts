export type PropertyDocumentType =
  | 'folio_real'
  | 'testimonio'
  | 'plano'
  | 'impuestos'
  | 'poder'
  | 'contrato'
  | 'minuta'
  | 'ci_propietario'
  | 'servicios_basicos'
  | 'otro';

export type PropertyDocumentStatus = 'pending' | 'verified' | 'rejected' | 'expired';

export interface PropertyDocument {
  id: string;
  propertyId: string;
  documentType: PropertyDocumentType;
  fileUrl: string;
  storageKey: string;
  status: PropertyDocumentStatus;
  uploadedBy: string;
  verifiedBy?: string;
  verifiedAt?: Date;
  expirationDate?: Date;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}
