import { CRMPage } from '../pages/CRMPage';
import { LeadsPage } from '../pages/LeadsPage';
import { PipelinePage } from '../pages/PipelinePage';

export const crmRoutes = [
  { path: 'crm', element: <CRMPage /> },
  { path: 'crm/leads', element: <LeadsPage /> },
  { path: 'crm/pipeline', element: <PipelinePage /> },
];
