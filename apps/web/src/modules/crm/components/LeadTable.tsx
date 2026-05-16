import { Table } from '@shared/components/ui/table';
import { leadService } from '../services/lead.service';
import type { Lead } from '../types/lead.types';

export function LeadTable({ leads }: { leads: Lead[] }) {
  return (
    <Table>
      <thead>
        <tr>
          <th>Lead</th>
          <th>Empresa</th>
          <th>Score</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        {leads.map((lead) => (
          <tr key={lead.id}>
            <td>{lead.name}</td>
            <td>{lead.company}</td>
            <td>{lead.score}</td>
            <td>{leadService.getLeadScoreLabel(lead)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
