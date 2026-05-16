export const aiassistantSchema = {
  required: ['name', 'status', 'owner'],
  statuses: ['active', 'draft', 'archived'],
} as const;
