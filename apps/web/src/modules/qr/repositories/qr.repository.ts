import type { Repository } from '@core/interfaces/repository.interface';
import type { QrItem } from '../types/qr.types';

const seedItems: QrItem[] = [
  { id: 'qr-1', name: 'QR operativo', status: 'active', owner: 'Growth Team' },
  { id: 'qr-2', name: 'QR discovery', status: 'draft', owner: 'Product Team' },
];

export const qrRepository: Repository<QrItem> = {
  async findAll() {
    return seedItems;
  },
  async findById(id) {
    return seedItems.find((item) => item.id === id) ?? null;
  },
};
