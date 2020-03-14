<template>
  <v-content>
    <events-list-view v-if="activeView === viewsKeys.groups || activeView === viewsKeys.users" />

    <settings-view v-else-if="activeView === viewsKeys.settings" />

    <v-snackbar
      v-model="showMessageText"
      :color="messageColor"
    >
      {{ messageText }}

      <v-btn
        text
        @click="showMessageText = false"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </v-content>
</template>

<script>
  import { get, call, sync } from 'vuex-pathify'

  import { viewsKeys } from '@/configurations/app'
  import EventsListView from './EventsListView'
  import SettingsView from './SettingsView'


  export default {
    name: 'ContentView',
    components: { EventsListView, SettingsView },

    data () {
      return {
        viewsKeys
      }
    },

    computed: {
      ...get({
        activeView: 'activeView',
        messageText: 'messageText',
        messageColor: 'messageColor'
      }),
      ...sync({
        showMessageText: 'showMessageText'
      }),
      ...sync('events',{
        pageNumber: 'pageNumber'
      })
    },

    watch: {
      activeView: {
        handler () {
          this.pageNumber = 0
        },
        immediate: true
      }
    },

    created () {
      this.initEventsState()
    },

    methods: {
      ...call('events', {
        initEventsState: 'initEventsState'
      })
    }
  }
</script>

<style lang="scss" scoped>

</style>
