import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router'

// 【广告位管理】 公共的css
import './style.css'

Vue.config.productionTip = false

import http from './http'
//挂载路由到原型对象
Vue.prototype.$http = http

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
