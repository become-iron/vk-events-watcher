<template>
  <v-card
    class="event-controller"
    :class="{
      'is-add-event': event.eventType === eventTypes.add,
      'is-remove-event': event.eventType === eventTypes.remove,
      'is-change-event': event.eventType === eventTypes.change
    }"
    outlined
  >
    <div class="d-flex align-center pr-2 py-1">
      <div
        class="event-controller__icon pa-2 pr-3 mr-3 my-n1 d-flex align-center justify-center flex-grow-0 align-self-stretch"
        :title="$t(`events.${event.eventType}`)"
      >
        <v-icon color="white">
          {{ eventIcon }}
        </v-icon>
      </div>

      <div class="d-flex flex-column flex-grow-1">
        <div class="d-flex align-center">
          <v-avatar
            color="indigo lighten-5"
            class="mr-3"
            size="36"
          >
            <v-img :src="event.entityData.photo_50" />
          </v-avatar>

          <div class="event-controller__content d-flex flex-grow-1">
            <div class="event-controller__title">
              <a
                class="text-break font-weight-medium"
                :href="eventEntityURL"
                target="_blank"
              >
                {{ eventEntityTitle }}
              </a>
            </div>

            <div
              class="event-controller__date"
              :title="formattedDateTitle"
            >
              {{ formattedDate }}
            </div>
          </div>
        </div>

        <entity-changes-table
          v-if="event.eventType === eventTypes.change"
          :event="event"
        />
      </div>
    </div>
  </v-card>
</template>

<script>
  import { get } from 'vuex-pathify'
  import { format, formatRelative } from 'date-fns'
  import { ru } from 'date-fns/locale'

  import settings from '@/settings'
  import { entityTypes, viewTypeToEntityType } from '@/configurations/entity'
  import { eventTypes } from '@/configurations/event'
  import { viewsKeys } from '@/configurations/app'
  import { EventData } from '@/interfaces/event'
  import { getEntityURL } from '@/utils/vk'
  import EntityChangesTable from './EntityChangesTable'


  const eventIcon = {
    [viewsKeys.groups]: {
      [eventTypes.add]: 'mdi-account-multiple-plus',
      [eventTypes.remove]: 'mdi-account-multiple-remove',
      [eventTypes.change]: 'mdi-pencil'
    },
    [viewsKeys.users]: {
      [eventTypes.add]: 'mdi-account-plus',
      [eventTypes.remove]: 'mdi-account-remove',
      [eventTypes.change]: 'mdi-account-edit'
    }
  }

  export default {
    name: 'EventController',
    components: { EntityChangesTable },

    props: {
      event: {
        type: EventData,
        required: true
      }
    },

    data () {
      return {
        eventTypes
      }
    },

    computed: {
      ...get({
        currentTime: 'currentTime',
        activeView: 'activeView'
      }),

      eventIcon () {
        return eventIcon[this.activeView][this.event.eventType]
      },

      entityType () {
        return viewTypeToEntityType[this.activeView]
      },

      eventEntityTitle () {
        switch (this.entityType) {
          case entityTypes.group:
            return this.event.entityData.name
          case entityTypes.user:
            return `${this.event.entityData.first_name} ${this.event.entityData.last_name}`
          default:
            return null
        }
      },

      eventEntityURL () {
        return getEntityURL(this.entityType, this.event.entityData)
      },

      formattedDate () {
        return formatRelative(new Date(this.event.eventDate), this.currentTime, { locale: ru })
      },

      formattedDateTitle () {
        return format(new Date(this.event.eventDate), settings.eventDateTitleFormat, { locale: ru })
      }
    }
  }
</script>

<style lang="scss" scoped>
  $add-event-color: #81c784;
  $remove-event-color: #e57373;
  $change-event-color: #ffb74d;

  .event-controller {
    overflow: hidden;

    .event-controller__icon {
      border-top-left-radius: 3px;
      border-bottom-left-radius: 3px;
    }

    &.is-add-event {
      border-color: $add-event-color;

      .event-controller__icon {
        background-color: $add-event-color;
      }
    }

    &.is-remove-event {
      border-color: $remove-event-color;

      .event-controller__icon {
        background-color: $remove-event-color;
      }
    }

    &.is-change-event {
      border-color: $change-event-color;

      .event-controller__icon {
        background-color: $change-event-color;
      }
    }

    .event-controller__content {
      flex-direction: column;

      .event-controller__title a {
        font-size: 0.9rem;
        color: inherit;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }

      .event-controller__date {
        font-size: 0.8rem;
      }
    }
  }
</style>
