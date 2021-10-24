// =========================================================
// * Vuetify Material Dashboard PRO - v2.1.0
// =========================================================
//
// * Product Page: https://www.creative-tim.com/product/vuetify-material-dashboard-pro
// * Copyright 2019 Creative Tim (https://www.creative-tim.com)
//
// * Coded by Creative Tim
//
// =========================================================
//
// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/base'
import './plugins/chartist'
import './plugins/vee-validate'
import './plugins/vue-world-map'
import vuetify from './plugins/vuetify'
import i18n from './i18n'
import VueResource from 'vue-resource'
import axios from 'axios'


Vue.use(VueResource)


// This function takes all of the requests made on the page and includes headers
Vue.http.interceptors.push((request, next) => {
  var accessToken = localStorage.getItem('accessToken')
  var csrfToken = document.querySelector('meta[name="csrf-token"]')
  request.headers.set('X-CSRF-TOKEN', csrfToken)
  request.headers.set('Authorization', `Bearer ${accessToken}`)
  request.headers.set('Access-Control-Allow-Origin', '*')
  
  // This function returns the reponse and if there is a 401 unautorized then we log the user out
  next(function(res){
    // Check to see if we are in production or not
    let url = res.url.substr(0,5)
    if(!res.ok && url != 'http:' && !res.url.includes('project')){
      store.dispatch("logoutNoToken").then(res => {
        router.push({ name: 'Logout' })
      })
      
    } else {
      
    }
    
  })
})



new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App),
}).$mount('#app')