export const mailConfig = {
  from: process.env.MAIL_FROM ?? 'noreply@unicron.local',
  provider: process.env.MAIL_PROVIDER ?? 'console',
};
