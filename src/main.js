import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

Vue.config.productionTip = false

import 'bootstrap'  // Bootstrap js

Vue.component('FinderWindow', () => import('@/components/FinderWindow'))

Vue.directive('focus-on-create', {
  inserted: function (el) {
      el.focus()
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
