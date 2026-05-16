export const usersSchema = {
  required: ['name', 'status', 'owner'],
  statuses: ['active', 'draft', 'archived'],
} as const;
