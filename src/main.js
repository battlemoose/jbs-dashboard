/*!

=========================================================
* Vue Argon Dashboard - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import ArgonDashboard from './plugins/argon-dashboard'
import tesla from './service/tesla'
import openweather from './service/openweather'
import wunderground from './service/weather-underground'
import solaredgeWeb from './service/solaredge-web'
import solaredgeApi from '@/service/solaredge-api'
import 'weather-icons2/css/weather-icons.min.css'
import 'weather-icons2/css/weather-icons-wind.min.css'

tesla.init()
openweather.init()
wunderground.init()
solaredgeWeb.init()
solaredgeApi.init()

Vue.config.productionTip = false

Vue.use(ArgonDashboard)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
