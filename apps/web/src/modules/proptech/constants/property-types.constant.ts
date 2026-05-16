import type { PropertyType, OperationType, PublicationStatus, LegalStatus, Currency } from '../types/property.types';

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  apartment: 'Departamento',
  house: 'Casa',
  office: 'Oficina',
  land: 'Terreno',
  commercial: 'Local comercial',
  warehouse: 'Almacén',
  parking: 'Parqueo',
};

export const OPERATION_TYPE_LABELS: Record<OperationType, string> = {
  sale: 'Venta',
  rent: 'Alquiler',
  anticretico: 'Anticrético',
};

export const PUBLICATION_STATUS_LABELS: Record<PublicationStatus, string> = {
  unpublished: 'No publicado',
  pending_review: 'Pendiente de revisión',
  published: 'Publicado',
};

export const LEGAL_STATUS_LABELS: Record<LegalStatus, string> = {
  clear: 'Saneado',
  in_process: 'En proceso',
  encumbered: 'Con gravamen',
  unknown: 'Sin determinar',
};

export const CURRENCY_LABELS: Record<Currency, string> = {
  USD: 'Dólar americano',
  BOB: 'Boliviano',
  EUR: 'Euro',
};
