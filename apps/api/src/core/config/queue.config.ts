import { QUEUES } from '../constants/queue.constants.js';

export const queueConfig = {
  defaultQueue: QUEUES.DEFAULT,
  prefix: process.env.QUEUE_PREFIX ?? 'unicron',
};
