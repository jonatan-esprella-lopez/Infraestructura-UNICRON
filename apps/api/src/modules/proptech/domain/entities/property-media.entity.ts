export type MediaType = 'image' | 'video' | 'blueprint' | 'virtual_tour' | 'document';

export interface PropertyMedia {
  id: string;
  propertyId: string;
  mediaType: MediaType;
  url: string;
  storageKey: string;
  title?: string;
  description?: string;
  orderIndex: number;
  isMain: boolean;
  createdAt: Date;
  updatedAt: Date;
}
