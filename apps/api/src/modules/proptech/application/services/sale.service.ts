import type { PropertySale } from '../../domain/entities/property-sale.entity.js';
import type { IPropertySaleRepository, SaleFilters } from '../../domain/repositories/property-sale.repository.js';

export interface CreateSaleDto {
  tenantId: string;
  agentId?: string;
  clientId?: string;
  propertyId?: string;
  saleType: PropertySale['saleType'];
  productOrService: string;
  amount: number;
  currency: string;
  paymentMethod: PropertySale['paymentMethod'];
  saleLocation: PropertySale['saleLocation'];
  saleChannel: PropertySale['saleChannel'];
  notes?: string;
  soldAt?: Date;
}

export class SaleService {
  constructor(private readonly repository: IPropertySaleRepository) {}

  async list(filters: SaleFilters): Promise<PropertySale[]> {
    return this.repository.findAll(filters);
  }

  async findById(id: string): Promise<PropertySale | null> {
    return this.repository.findById(id);
  }

  async create(dto: CreateSaleDto): Promise<PropertySale> {
    return this.repository.create({
      ...dto,
      soldAt: dto.soldAt ?? new Date(),
    });
  }

  async update(id: string, data: Partial<CreateSaleDto>): Promise<PropertySale> {
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
