export const rolesSchema = {
  required: ['name', 'status', 'owner'],
  statuses: ['active', 'draft', 'archived'],
} as const;
