export interface UpdateLeadDto {
  email?: string;
  name?: string;
  phone?: string;
  status?: 'new' | 'qualified' | 'converted' | 'lost';
}
