import orderBy from 'lodash/orderBy'
import difference from 'lodash/difference'
import Vue from 'vue'
import Dexie from 'dexie'

import settings from '@/settings'
import i18n from '@/i18n'
import { entityTypes } from '@/configurations/entity'
import { EventData } from '@/interfaces/event'
import { showErrorMessage } from '@/utils/common'


const storeTypes = Object.freeze({
  entities: 'entities',
  events: 'events'
})

let storeDataBase

export function initializeStoreDataBase () {
  storeDataBase = new Dexie(settings.appCodeName)

  const eventsTableSchema = difference(
    Object.keys(new EventData({})),
    ['isNewEvent']
  )
    .join(',')
  const dbSchema = Object.values(entityTypes).reduce((acc, entityType) => {
    const entitiesTableName = getStoreName(storeTypes.entities, entityType)
    acc[entitiesTableName] = ['id', settings.fieldsToCompare[entityType]].join(',')
    const eventsTableName = getStoreName(storeTypes.events, entityType)
    acc[eventsTableName] = eventsTableSchema
    return acc
  }, {})
  storeDataBase.version(1).stores(dbSchema)
}

function getStoreName (storeType, entityType) {
  const userID = Vue.store.get('auth/userID')
  return `${storeType}:${entityType}:${userID}`
}

async function getStoredData (storeName) {
  try {
    const table = storeDataBase[storeName]
    return table.toArray()
  } catch (error) {
    await showErrorMessage(i18n.t('errors.errorDuringWorkWithLongTermStore'))
    throw error
  }
}

async function setStoredData (storeName, items) {
  try {
    const table = storeDataBase[storeName]
    await table.clear()
    await table.bulkAdd(items)
  } catch (error) {
    await showErrorMessage(i18n.t('errors.errorDuringWorkWithLongTermStore'))
    throw error
  }
}

async function addStoredData (storeName, items) {
  try {
    const table = storeDataBase[storeName]
    await table.bulkAdd(items)
  } catch (error) {
    await showErrorMessage(i18n.t('errors.errorDuringWorkWithLongTermStore'))
    throw error
  }
}

export async function getPreservedEntities (entityType) {
  try {
    const storeName = getStoreName(storeTypes.entities, entityType)
    return getStoredData(storeName)
  } catch (error) {
    await showErrorMessage(i18n.t('errors.errorDuringWorkWithLongTermStore'))
    throw error
  }
}

export async function setPreservedEntities (entityType, entities) {
  try {
    const storeName = getStoreName(storeTypes.entities, entityType)
    await setStoredData(storeName, entities)
  } catch (error) {
    await showErrorMessage(i18n.t('errors.errorDuringWorkWithLongTermStore'))
    throw error
  }
}

export async function getPreservedEvents (entityType) {
  try {
    const storeName = getStoreName(storeTypes.events, entityType)
    const rawEvents = await getStoredData(storeName)
    const events = rawEvents.map(rawEvent => {
      rawEvent.isNewEvent = false
      return new EventData(rawEvent)
    })
    return orderBy(events, ['eventDate'], ['desc'])
  } catch (error) {
    await showErrorMessage(i18n.t('errors.errorDuringWorkWithLongTermStore'))
    throw error
  }
}

export async function addPreservedEvents (entityType, events) {
  try {
    const storeName = getStoreName(storeTypes.events, entityType)
    await addStoredData(storeName, events)
  } catch (error) {
    await showErrorMessage(i18n.t('errors.errorDuringWorkWithLongTermStore'))
    throw error
  }
}

export async function resetEntitiesStores () {
  try {
    await Promise.all(
      Object.values(storeTypes)
        .flatMap(
          storeType => Object.values(entityTypes)
            .map(async entityType => {
              const storeName = getStoreName(storeType, entityType)
              const store = storeDataBase[storeName]
              await store.clear()
            })
        )
    )
  } catch (error) {
    await showErrorMessage(i18n.t('errors.errorDuringWorkWithLongTermStore'))
    throw error
  }
}
