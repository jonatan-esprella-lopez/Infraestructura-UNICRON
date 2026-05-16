export const campaignsSchema = {
  required: ['name', 'status', 'owner'],
  statuses: ['active', 'draft', 'archived'],
} as const;
