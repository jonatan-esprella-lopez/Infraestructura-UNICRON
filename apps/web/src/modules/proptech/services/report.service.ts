import { environment } from '@bootstrap/environment';
import type {
  SalesTotalReport,
  ByPaymentMethodReport,
  ByLocationReport,
  ByAgentReport,
  ByPeriodReport,
} from '../types/sale.types';

const BASE = `${environment.apiBaseUrl}/v1/proptech/reports`;

interface ReportFilters {
  from?: string;
  to?: string;
  currency?: string;
}

function buildParams(filters: ReportFilters & { granularity?: string }): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined) params.set(k, v);
  });
  return params.toString();
}

export const reportService = {
  async salesTotal(filters: ReportFilters = {}): Promise<SalesTotalReport> {
    const res = await fetch(`${BASE}/sales-total?${buildParams(filters)}`);
    if (!res.ok) throw new Error('Error al obtener total de ventas');
    return res.json() as Promise<SalesTotalReport>;
  },

  async byPaymentMethod(filters: ReportFilters = {}): Promise<ByPaymentMethodReport[]> {
    const res = await fetch(`${BASE}/by-payment-method?${buildParams(filters)}`);
    if (!res.ok) throw new Error('Error al obtener reporte por método de pago');
    return res.json() as Promise<ByPaymentMethodReport[]>;
  },

  async byLocation(filters: ReportFilters = {}): Promise<ByLocationReport[]> {
    const res = await fetch(`${BASE}/by-location?${buildParams(filters)}`);
    if (!res.ok) throw new Error('Error al obtener reporte por ubicación');
    return res.json() as Promise<ByLocationReport[]>;
  },

  async byAgent(filters: ReportFilters = {}): Promise<ByAgentReport[]> {
    const res = await fetch(`${BASE}/by-agent?${buildParams(filters)}`);
    if (!res.ok) throw new Error('Error al obtener reporte por agente');
    return res.json() as Promise<ByAgentReport[]>;
  },

  async byPeriod(filters: ReportFilters & { granularity?: 'day' | 'month' | 'year' } = {}): Promise<ByPeriodReport[]> {
    const res = await fetch(`${BASE}/by-period?${buildParams(filters)}`);
    if (!res.ok) throw new Error('Error al obtener reporte por período');
    return res.json() as Promise<ByPeriodReport[]>;
  },
};
