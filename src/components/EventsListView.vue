<template>
  <v-container
    class="events-list pa-0"
    fluid
  >
    <!-- TODO -->
    <!--<template v-if="loading">-->
    <!--  <v-skeleton-loader-->
    <!--    v-for="i of 3"-->
    <!--    :key="i"-->
    <!--    class="mb-2"-->
    <!--    type="actions"-->
    <!--    elevation="1"-->
    <!--  />-->
    <!--</template>-->

    <v-col class="pb-0">
      <v-row
        class="mb-2 mx-0 flex-nowrap"
        align="center"
      >
        <v-select
          v-model="showOnlyNewEvents"
          class="flex-grow-0 mr-2"
          :items="showNewEventsOptions"
          dense
          outlined
          hide-details
        />

        <v-spacer />

        <v-btn
          :title="$t('events.updateEvents')"
          depressed
          @click="updateEvents"
        >
          <v-icon>
            mdi-reload
          </v-icon>
        </v-btn>
      </v-row>

      <event-controller
        v-for="event of displayedEntityEvents"
        :key="event.id"
        class="mb-3"
        :event="event"
      />

      <v-row
        v-if="!displayedEntityEvents.length"
        class="mx-0"
      >
        <v-sheet
          class="flex-grow-1 px-2 py-1"
          color="blue-grey lighten-5"
        >
          {{ $t('events.noEvents') }}
        </v-sheet>
      </v-row>
    </v-col>
  </v-container>
</template>

<script>
  import { get, call, sync } from 'vuex-pathify'

  import { viewTypeToEntityType } from '@/configurations/entity'
  import { isBottomVisible } from '@/utils/common'
  import EventController from './EventController'


  export default {
    name: 'EventsListView',
    components: { EventController },

    computed: {
      ...get({
        activeView: 'activeView'
      }),
      ...get('events',{
        entityTypesEventsNumber: 'entityTypesEventsNumber',
        entityTypesNewEventsNumber: 'entityTypesNewEventsNumber',
        displayedEntityEvents: 'displayedEntityEvents',
        pageSize: 'pageSize',
        numberOfPages: 'numberOfPages'
      }),
      ...sync('events', {
        pageNumber: 'pageNumber',
        showOnlyNewEvents: 'showOnlyNewEvents'
      }),

      entityType () {
        return viewTypeToEntityType[this.activeView]
      },

      showNewEventsOptions () {
        return [
          {
            value: true,
            text: `${this.$t('events.showOnlyNewEvents')} (${this.entityTypesNewEventsNumber[this.entityType]})`
          },
          {
            value: false,
            text: `${this.$t('events.showAllEvents')} (${this.entityTypesEventsNumber[this.entityType]})`
          }
        ]
      }
    },

    created () {
      window.addEventListener('scroll', this.addEvents)
      this.$once('hook:beforeDestroy', () => window.removeEventListener('scroll', this.addEvents))
    },

    methods: {
      ...call('events', {
        setEntityTypeEvents: 'setEntityTypeEvents'
      }),

      addEvents () {
        if (isBottomVisible(250) && this.pageNumber < this.numberOfPages) {
          this.pageNumber += 1
        }
      },

      updateEvents () {
        this.pageNumber = 0
        this.setEntityTypeEvents(viewTypeToEntityType[this.activeView])
      }
    }
  }
</script>

<style lang="scss" scoped>
  .events-list {

  }
</style>
