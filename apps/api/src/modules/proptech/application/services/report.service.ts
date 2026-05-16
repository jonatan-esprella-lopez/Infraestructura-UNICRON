import type { PropertySale, PaymentMethod, SaleLocation } from '../../domain/entities/property-sale.entity.js';
import type { IPropertySaleRepository } from '../../domain/repositories/property-sale.repository.js';

export interface SalesTotalReport {
  total: number;
  count: number;
  average: number;
  currency: string;
}

export interface ByPaymentMethodReport {
  method: PaymentMethod;
  total: number;
  count: number;
  percentage: number;
}

export interface ByLocationReport {
  location: SaleLocation;
  total: number;
  count: number;
  percentage: number;
}

export interface ByAgentReport {
  agentId: string;
  total: number;
  count: number;
  average: number;
}

export interface ByPeriodReport {
  period: string;
  total: number;
  count: number;
}

export interface ReportFilters {
  tenantId: string;
  from?: Date;
  to?: Date;
  currency?: string;
}

export class ReportService {
  constructor(private readonly saleRepository: IPropertySaleRepository) {}

  async salesTotal(filters: ReportFilters): Promise<SalesTotalReport> {
    const sales = await this.getSales(filters);
    const total = sales.reduce((sum, s) => sum + s.amount, 0);
    return {
      total,
      count: sales.length,
      average: sales.length ? total / sales.length : 0,
      currency: filters.currency ?? 'BOB',
    };
  }

  async byPaymentMethod(filters: ReportFilters): Promise<ByPaymentMethodReport[]> {
    const sales = await this.getSales(filters);
    const grandTotal = sales.reduce((sum, s) => sum + s.amount, 0);
    const grouped = this.groupBy(sales, (s) => s.paymentMethod);

    return Object.entries(grouped).map(([method, items]) => {
      const total = items.reduce((sum, s) => sum + s.amount, 0);
      return {
        method: method as PaymentMethod,
        total,
        count: items.length,
        percentage: grandTotal > 0 ? Math.round((total / grandTotal) * 100 * 10) / 10 : 0,
      };
    });
  }

  async byLocation(filters: ReportFilters): Promise<ByLocationReport[]> {
    const sales = await this.getSales(filters);
    const grandTotal = sales.reduce((sum, s) => sum + s.amount, 0);
    const grouped = this.groupBy(sales, (s) => s.saleLocation);

    return Object.entries(grouped).map(([location, items]) => {
      const total = items.reduce((sum, s) => sum + s.amount, 0);
      return {
        location: location as SaleLocation,
        total,
        count: items.length,
        percentage: grandTotal > 0 ? Math.round((total / grandTotal) * 100 * 10) / 10 : 0,
      };
    });
  }

  async byAgent(filters: ReportFilters): Promise<ByAgentReport[]> {
    const sales = await this.getSales(filters);
    const grouped = this.groupBy(sales.filter((s) => s.agentId), (s) => s.agentId!);

    return Object.entries(grouped).map(([agentId, items]) => {
      const total = items.reduce((sum, s) => sum + s.amount, 0);
      return { agentId, total, count: items.length, average: total / items.length };
    });
  }

  async byPeriod(filters: ReportFilters, granularity: 'day' | 'month' | 'year' = 'month'): Promise<ByPeriodReport[]> {
    const sales = await this.getSales(filters);
    const grouped = this.groupBy(sales, (s) => this.periodKey(s.soldAt, granularity));

    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([period, items]) => ({
        period,
        total: items.reduce((sum, s) => sum + s.amount, 0),
        count: items.length,
      }));
  }

  private async getSales(filters: ReportFilters): Promise<PropertySale[]> {
    return this.saleRepository.findAll({
      tenantId: filters.tenantId,
      from: filters.from,
      to: filters.to,
    });
  }

  private groupBy<T>(arr: T[], key: (item: T) => string): Record<string, T[]> {
    return arr.reduce<Record<string, T[]>>((acc, item) => {
      const k = key(item);
      (acc[k] ??= []).push(item);
      return acc;
    }, {});
  }

  private periodKey(date: Date, granularity: 'day' | 'month' | 'year'): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    if (granularity === 'year') return `${y}`;
    if (granularity === 'day') return `${y}-${m}-${d}`;
    return `${y}-${m}`;
  }
}
