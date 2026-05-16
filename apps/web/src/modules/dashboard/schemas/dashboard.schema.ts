export const dashboardSchema = {
  required: ['name', 'status', 'owner'],
  statuses: ['active', 'draft', 'archived'],
} as const;
