import { make } from 'vuex-pathify'


function getState () {
  return {
    userID: null,
    token: null
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
  }
}
