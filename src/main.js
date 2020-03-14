import Vue from 'vue'

import store from './store'
import i18n from './i18n'
import vuetify from './plugins/vuetify'
import App from './App.vue'
import '@/assets/styles/index.scss'

// to deal with circular dependencies
Vue.store = store

Vue.config.productionTip = false

new Vue({
  store,
  i18n,
  vuetify,
  render: h => h(App)
}).$mount('#app')
