export interface IEventType {
  id?: number;
  description?: string | null;
}

export class EventType implements IEventType {
  constructor(public id?: number, public description?: string | null) {}
}

export function getEventTypeIdentifier(eventType: IEventType): number | undefined {
  return eventType.id;
}
