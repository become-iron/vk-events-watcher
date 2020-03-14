import mapValues from 'lodash/mapValues'
import { make } from 'vuex-pathify'
import Vue from 'vue'

import settings from '@/settings'
import { entityTypes, viewTypeToEntityType } from '@/configurations/entity'
import { analyzeEntities } from '@/utils/events'
import {
  addPreservedEvents,
  getPreservedEntities,
  getPreservedEvents,
  setPreservedEntities
} from '@/utils/longTermStore'
import { vkClient } from '@/utils/vkClient'


function getState () {
  return {
    events: {},

    pageNumber: 0,
    pageSize: 30,

    showOnlyNewEvents: true
  }
}

const storeState = getState()

export default {
  namespaced: true,

  state: storeState,

  mutations: {
    ...make.mutations(storeState),

    // resetStore (state) {
    //   Object.assign(state, getState())
    // }
  },

  getters: {
    newEntityTypeEvents (state) {
      return Object.values(entityTypes).reduce((acc, entityType) => {
        const events = state.events[entityType] || []
        acc[entityType] = events.filter(event => event.isNewEvent)
        return acc
      }, {})
    },

    entityTypesEventsNumber (state) {
      return Object.values(entityTypes).reduce((acc, entityType) => {
        const events = state.events[entityType] || []
        acc[entityType] = events.length
        return acc
      }, {})
    },

    entityTypesNewEventsNumber (state, getters) {
      return mapValues(getters.newEntityTypeEvents, events => events.length)
    },

    filteredEntityEvents (state, getters, rootState) {
      const entityType = viewTypeToEntityType[rootState.activeView]
      return state.showOnlyNewEvents
        ? getters.newEntityTypeEvents[entityType]
        : state.events[entityType]
    },

    displayedEntityEvents (state, getters) {
      const events = getters.filteredEntityEvents
      const endIndex = state.pageNumber * state.pageSize + state.pageSize
      return events.slice(0, endIndex)
    },

    numberOfPages (state, getters) {
      return Math.ceil(getters.filteredEntityEvents.length / state.pageSize)
    }
  },

  actions: {
    async initEventsState ({ dispatch }) {
      await Promise.all(
        Object.values(entityTypes)
          .map(entityType => dispatch('setEntityTypeEvents', entityType))
      )
    },

    async setEntityTypeEvents ({ dispatch }, entityType) {
      const [currentEntitiesState, preservedEntitiesState] = await Promise.all([
        dispatch('getEntityCurrentState', entityType),
        getPreservedEntities(entityType)
      ])

      const groupedNewEvents = analyzeEntities(entityType, currentEntitiesState, preservedEntitiesState)
      const newEvents = Object.values(groupedNewEvents).flat()

      const oldEvents = await getPreservedEvents(entityType)

      const events = [
        ...newEvents,
        ...oldEvents
      ]
      Vue.store.set(`events/events@${entityType}`, events)

      await Promise.all([
        setPreservedEntities(entityType, currentEntitiesState),
        addPreservedEvents(entityType, newEvents),
      ])
    },

    async getEntityCurrentState (context, entityType) {
      // WARN: request have the restriction of the number of returned values
      //   which could bypassed with "execute" method
      //   but such cases usually are unlikely

      if (entityType === entityTypes.group) {
        const result = await vkClient('groups.get', {
          extended: 1,
          fields: settings.groupsFields.join(',')
        })
        return result.items
      }
      else if (entityType === entityTypes.user) {
        const result = await vkClient('friends.get', {
          fields: settings.usersFields.join(',')
        })
        return result.items
      }
    }
  }
}
