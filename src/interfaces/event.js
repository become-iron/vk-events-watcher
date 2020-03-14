import uuid from 'uuid/v4'


export class EventData {
  constructor ({
    id = uuid(),
    entityID, entityType, entityData,
    eventType, eventDate, isNewEvent, eventData = null
  }) {
    this.id = id

    this.entityID = entityID
    this.entityType = entityType
    this.entityData = entityData

    this.eventType = eventType
    this.eventDate = eventDate
    this.isNewEvent = isNewEvent
    this.eventData = eventData
  }
}
