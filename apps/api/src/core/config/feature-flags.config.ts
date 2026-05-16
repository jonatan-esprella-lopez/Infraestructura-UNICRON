export const featureFlagsConfig = {
  aiEnabled: process.env.FEATURE_AI_ENABLED !== 'false',
  auditLogsEnabled: process.env.FEATURE_AUDIT_LOGS_ENABLED !== 'false',
  queuesEnabled: process.env.FEATURE_QUEUES_ENABLED !== 'false',
};
