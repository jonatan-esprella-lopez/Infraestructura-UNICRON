import { apiFetch } from '@shared/utils/api-fetch';
import type {
  SalesTotalReport,
  ByPaymentMethodReport,
  ByLocationReport,
  ByAgentReport,
  ByPeriodReport,
} from '../types/sale.types';

interface ReportFilters {
  from?: string;
  to?: string;
  currency?: string;
}

interface ReportApiResponse<T> { data: T }

function buildParams(filters: ReportFilters & { granularity?: string }): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined) params.set(k, v);
  });
  return params.toString();
}

export const reportService = {
  async salesTotal(filters: ReportFilters = {}): Promise<SalesTotalReport> {
    const res = await apiFetch(`/proptech/reports/sales-total?${buildParams(filters)}`);
    if (!res.ok) throw new Error('Error al obtener total de ventas');
    const json = (await res.json()) as ReportApiResponse<SalesTotalReport>;
    return json.data;
  },

  async byPaymentMethod(filters: ReportFilters = {}): Promise<ByPaymentMethodReport[]> {
    const res = await apiFetch(`/proptech/reports/by-payment-method?${buildParams(filters)}`);
    if (!res.ok) throw new Error('Error al obtener reporte por método de pago');
    const json = (await res.json()) as ReportApiResponse<ByPaymentMethodReport[]>;
    return json.data;
  },

  async byLocation(filters: ReportFilters = {}): Promise<ByLocationReport[]> {
    const res = await apiFetch(`/proptech/reports/by-location?${buildParams(filters)}`);
    if (!res.ok) throw new Error('Error al obtener reporte por ubicación');
    const json = (await res.json()) as ReportApiResponse<ByLocationReport[]>;
    return json.data;
  },

  async byAgent(filters: ReportFilters = {}): Promise<ByAgentReport[]> {
    const res = await apiFetch(`/proptech/reports/by-agent?${buildParams(filters)}`);
    if (!res.ok) throw new Error('Error al obtener reporte por agente');
    const json = (await res.json()) as ReportApiResponse<ByAgentReport[]>;
    return json.data;
  },

  async byPeriod(filters: ReportFilters & { granularity?: 'day' | 'month' | 'year' } = {}): Promise<ByPeriodReport[]> {
    const res = await apiFetch(`/proptech/reports/by-period?${buildParams(filters)}`);
    if (!res.ok) throw new Error('Error al obtener reporte por período');
    const json = (await res.json()) as ReportApiResponse<ByPeriodReport[]>;
    return json.data;
  },
};
