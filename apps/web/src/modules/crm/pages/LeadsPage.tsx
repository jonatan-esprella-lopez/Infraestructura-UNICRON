import { LeadTable } from '../components/LeadTable';
import { useLeads } from '../hooks/useLeads';

export function LeadsPage() {
  const { leads } = useLeads();
  return <LeadTable leads={leads} />;
}
