/*
 =========================================================
 * Vue Black Dashboard - v1.1.0
 =========================================================

 * Product Page: https://www.creative-tim.com/product/black-dashboard
 * Copyright 2018 Creative Tim (http://www.creative-tim.com)

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 */
import Vue from "vue";
import VueRouter from "vue-router";
import RouterPrefetch from 'vue-router-prefetch'
import App from "./App";
// TIP: change to import router from "./router/starterRouter"; to start with a clean layout
import router from "./router";
import vuetify from './plugins/vuetify'
import store from "./store"
import VueResource from 'vue-resource'
import BlackDashboard from "./plugins/blackDashboard";
import i18n from "./i18n"
import './registerServiceWorker'

Vue.use(VueResource)
Vue.use(BlackDashboard);
Vue.use(VueRouter);
Vue.use(RouterPrefetch);

// This function takes all of the requests made on the page and includes headers
Vue.http.interceptors.push((request, next) => {
  var accessToken = localStorage.getItem('access_token')
  var csrfToken = document.querySelector('meta[name="csrf-token"]')

  request.headers.set('X-CSRF-TOKEN', csrfToken)
  request.headers.set('Authorization', `Bearer ${accessToken}`)
  request.headers.set('Access-Control-Allow-Origin', '*')
  
  // This function returns the reponse and if there is a 401 unautorized then we log the user out
  next(function(res){
    
  })
})


/* eslint-disable no-new */
new Vue({
  router,
  i18n,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
