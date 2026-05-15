export interface Lead {
  id: string;
  name: string;
  company: string;
  score: number;
  stage: 'new' | 'qualified' | 'proposal' | 'won';
}
