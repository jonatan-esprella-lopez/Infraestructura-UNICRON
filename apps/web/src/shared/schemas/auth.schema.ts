export const authSchema = {
  fields: ['email', 'password'],
  minPasswordLength: 8,
} as const;
