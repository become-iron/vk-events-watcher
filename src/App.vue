<template>
  <v-app>
    <template v-if="ready">
      <main-menu />

      <content-view />
    </template>
  </v-app>
</template>

<script>
  import { initializeStoreDataBase } from '@/utils/longTermStore'
  import { vkClient } from '@/utils/vkClient'
  import MainMenu from './components/MainMenu'
  import ContentView from './components/ContentView'


  export default {
    name: 'App',
    components: { MainMenu, ContentView },

    data () {
      return {
        ready: false
      }
    },

    async created () {
      await this.initApp()

      setInterval(
        () => {
          this.$store.set('currentTime', Date.now())
        },
        5 * 60 * 1000  // 5 minutes
      )
    },

    methods: {
      async initApp () {
        await vkClient.initClient()

        initializeStoreDataBase()

        this.ready = true
      }
    }
  }
</script>
