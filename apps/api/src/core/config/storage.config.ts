export const storageConfig = {
  bucket: process.env.STORAGE_BUCKET ?? 'local',
  driver: process.env.STORAGE_DRIVER ?? 'local',
};
