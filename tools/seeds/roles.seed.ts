export const rolesSeed = [
  { id: 'owner', permissions: ['*'] },
  { id: 'admin', permissions: ['modules:read', 'crm:manage', 'campaigns:manage'] },
  { id: 'analyst', permissions: ['modules:read', 'analytics:read'] },
];
