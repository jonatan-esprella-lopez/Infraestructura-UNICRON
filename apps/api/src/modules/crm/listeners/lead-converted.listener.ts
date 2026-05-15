import type { EventHandler } from '../../../core/interfaces/event-handler.interface.js';

export function createLeadConvertedListener(): EventHandler {
  return {
    eventName: 'lead.converted',
    handle: (event) => {
      void event;
    },
  };
}
