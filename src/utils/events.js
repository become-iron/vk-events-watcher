import settings from '@/settings'
import keyBy from 'lodash/keyBy'

import { eventTypes } from '@/configurations/event'
import { EventData } from '@/interfaces/event'
import { getObjectsDifferencesByValues } from '@/utils/func'


// export const currentStoreDataFormatVersion = '1'

// export const storeDataFormatMigrations = [
//   // example
//   // {
//   //   from: '1',
//   //   to: '2',
//   //   processor (state, events) {}
//   // }
// ]

export function analyzeEntities (entityType, newState, oldState) {
  // TODO: try to find out the exact time of event
  const eventDate = Date.now()
  const fieldsToCompare = settings.fieldsToCompare[entityType]

  const oldStateIndex = keyBy(oldState, 'id')

  const eventsAdded = []
  const eventsChanged = []

  for (const entity of newState) {
    const entityID = entity.id

    if (entityID in oldStateIndex) {
      const oldEntityState = oldStateIndex[entityID]
      const statesDifference = getObjectsDifferencesByValues(oldEntityState, entity, fieldsToCompare)

      // changed
      if (Object.keys(statesDifference).length) {
        const event = new EventData({
          entityID,
          entityType,
          entityData: entity,
          eventType: eventTypes.change,
          eventDate,
          isNewEvent: true,
          eventData: statesDifference
        })
        eventsChanged.push(event)
      }

      delete oldStateIndex[entityID]  // to leave only the removed entities
    } else {
      // added
      const event = new EventData({
        entityID,
        entityType,
        entityData: entity,
        eventType: eventTypes.add,
        eventDate,
        isNewEvent: true
      })
      eventsAdded.push(event)
    }
  }

  // removed
  const eventsRemoved = Object.values(oldStateIndex).map(entity => {
    const entityID = entity.id
    return new EventData({
      entityID,
      entityType,
      entityData: entity,
      eventType: eventTypes.remove,
      eventDate,
      isNewEvent: true
    })
  })

  return {
    [eventTypes.add]: eventsAdded,
    [eventTypes.remove]: eventsRemoved,
    [eventTypes.change]: eventsChanged
  }
}

// export function normalizeCurrentGroupsData (data) {
//
// }
//
// export function normalizeCurrentFriendsData (data) {
//
// }

// export function findGroupsStatesDifference (newState, oldState) {
//
// }

// export function findFriendsStatesDifference (newState, oldState) {
//
// }
