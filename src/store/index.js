import Vue from 'vue'
import Vuex from 'vuex'
import { make } from 'vuex-pathify'

import pathify from './pathify'
import { viewsKeys } from '@/configurations/app'
import authStoreModule from '@/store/auth.module'
import eventsStoreModule from '@/store/events.module'
import { isDesktopPlatform } from '@/utils/vk'


Vue.use(Vuex)

function getState () {
  return {
    isDesktop: isDesktopPlatform(),

    currentTime: Date.now(),
    activeView: viewsKeys.groups,

    showMessageText: false,
    messageColor: null,
    messageText: ''
  }
}

const storeState = getState()

export default new Vuex.Store({
  plugins: [pathify.plugin],

  modules: {
    auth: authStoreModule,
    events: eventsStoreModule
  },

  state: storeState,

  mutations: {
    ...make.mutations(storeState),

    // resetStore (state) {
    //   Object.assign(state, getState())
    // }
  }
})
