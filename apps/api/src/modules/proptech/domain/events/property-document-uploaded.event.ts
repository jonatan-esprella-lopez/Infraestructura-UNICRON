export const PROPERTY_DOCUMENT_UPLOADED = 'proptech.property_document.uploaded';

export interface PropertyDocumentUploadedPayload {
  documentId: string;
  propertyId: string;
  documentType: string;
  uploadedBy: string;
}
