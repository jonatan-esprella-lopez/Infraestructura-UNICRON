import { EventName } from '../../../core/enums/event.enum.js';
import type { EventHandler } from '../../../core/interfaces/event-handler.interface.js';

export function createLeadCreatedListener(): EventHandler {
  return {
    eventName: EventName.LeadCreated,
    handle: (event) => {
      void event;
    },
  };
}
