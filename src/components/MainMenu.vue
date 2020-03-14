<template>
  <v-app-bar
    color="white"
    app
    dense
    elevate-on-scroll
  >
    <v-toolbar-title v-if="!isDesktop">
      EventsWatcher
    </v-toolbar-title>

    <template v-slot:[tabsSlotName]>
      <v-tabs
        v-model="activeTab"
        grow
        icons-and-text
        show-arrows
      >
        <v-tab>
          <v-chip
            class="ma-1"
            :title="$t('events.numberOfNewEvents')"
            x-small
          >
            {{ entityTypesNewEventsNumber[entityTypes.group] }}
          </v-chip>
          {{ $t(`${viewsKeys.groups}.title`) }}
        </v-tab>

        <v-tab>
          <v-chip
            class="ma-1"
            :title="$t('events.numberOfNewEvents')"
            x-small
          >
            {{ entityTypesNewEventsNumber[entityTypes.user] }}
          </v-chip>
          {{ $t(`${viewsKeys.users}.title`) }}
        </v-tab>

        <v-tab>
          <v-icon>
            mdi-help-circle-outline
          </v-icon>
        </v-tab>
      </v-tabs>
    </template>
  </v-app-bar>
</template>

<script>
  import { get, sync } from 'vuex-pathify'

  import { entityTypes } from '@/configurations/entity'
  import { viewsKeys } from '@/configurations/app'


  export default {
    name: 'MainMenu',

    data () {
      return {
        entityTypes,
        viewsKeys
      }
    },

    computed: {
      ...get({
        isDesktop: 'isDesktop'
      }),
      ...sync({
        activeView: 'activeView'
      }),
      ...get('events', {
        entityTypesNewEventsNumber: 'entityTypesNewEventsNumber'
      }),

      tabsSlotName () {
        return this.isDesktop ? 'default' : 'extension'
      },

      activeTab: {
        get () {
          switch (this.activeView) {
            case viewsKeys.groups:
              return 0
            case viewsKeys.users:
              return 1
            case viewsKeys.settings:
              return 2
            default:
              return null
          }
        },
        set (tabIndex) {
          let activeView

          switch (tabIndex) {
            case 0:
              activeView = viewsKeys.groups
              break
            case 1:
              activeView = viewsKeys.users
              break
            case 2:
              activeView = viewsKeys.settings
              break
            default:
              activeView = null
          }

          this.activeView = activeView
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .v-chip:hover {
    cursor: pointer;
  }
</style>
