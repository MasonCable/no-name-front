import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const checkLoginStatus = (state) => {
  return false
}

export default new Vuex.Store({
  state: {
    barColor: 'rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)',
    // barImage: 'https://demos.creative-tim.com/material-dashboard-pro/assets/img/sidebar-1.jpg',
    barImage: './assets/textbroker.jpg',
    drawer: null,
    access_token: localStorage.getItem('accessToken') || '',
    email: localStorage.getItem('email') || '',
    user_id: localStorage.getItem('user_id') || '',
    is_admin: localStorage.getItem('isAdmin') || '',
    permissions: localStorage.getItem('permissions') || [],
    first_name: '',
    last_name: '',
    loading: false
  },
  mutations: {
    SET_BAR_IMAGE (state, payload) {
      state.barImage = payload
    },
    SET_DRAWER (state, payload) {
      state.drawer = payload
    },
    SET_SCRIM (state, payload) {
      state.barColor = payload
    },
    auth_request(state) {
      state.status = 'Loading'
    },
    auth_success(state,email,access_token) {
        state.access_token = access_token
        state.email = email
        state.user_id = localStorage.getItem('user_id')
        state.is_admin = localStorage.getItem('isAdmin')
    },
    auth_error(state){
      state.status = 'error'
      state.isLoggedIn = false
    },
    logout(state){
      state.status = ''
      state.token = ''
      state.access_token = ''
      state.isLoggedIn = false
      
    },
    setName(state, payload){
      state.first_name = payload['first_name']
      state.last_name = payload['last_name']
      let name = `${payload['first_name']} ${payload['last_name']}`
      localStorage.setItem('name', name)
    }
  },
  actions: {
    login({ commit }, loginData) {
      return new Promise((resolve, reject) => {
          commit('auth_request')
      Vue.http.post(`${process.env.VUE_APP_SERVICE_URL}/login`, {
              ...loginData
          })
          .then(res => {
            // console.log(res.data)
              localStorage.setItem('accessToken', res.data.access_token)
              localStorage.setItem('email', res.data.email)
              localStorage.setItem('isAdmin', res.data.isAdmin)
              localStorage.setItem('user_id', res.data.id)
              var permissionList = []
              res.data.permissions.forEach(item => {
                permissionList.push(item.name)
              })
              localStorage.setItem('permissions', permissionList)
              const payload = {
                first_name: res.data.first_name,
                last_name: res.data.last_name
              }
              commit('auth_success', res.data.email, res.data.access_token)
              commit('setName', payload)
              resolve(res)
          })
          .catch(err => {
              commit('auth_error')
              localStorage.removeItem('accessToken')
              localStorage.removeItem('email')
              localStorage.removeItem('isAdmin')
              localStorage.removeItem('permissions')
              localStorage.removeItem('user_id')
              reject(err)
          })
      })
    },
    loginAs({commit}, userId){
      return new Promise((resolve, reject) => {
        Vue.http.get(`${process.env.VUE_APP_SERVICE_URL}/login-as/${userId}`)
        .then(res => {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('email')
            localStorage.removeItem('isAdmin')
            localStorage.removeItem('user_id')
            // After we remove all of the stored data from the current user we store the new data
            localStorage.setItem('accessToken', res.data.access_token)
            localStorage.setItem('user_id', res.data.user_id)
            localStorage.setItem('email', res.data.email)
            localStorage.setItem('isAdmin', res.data.isAdmin)
            const payload = {
              first_name: res.data.first_name,
              last_name: res.data.last_name
            }
            commit('auth_success', res.data.email, res.data.access_token)
            commit('setName', payload)
            
            resolve(res)
        }).catch(err => {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('email')
          localStorage.removeItem('isAdmin')
          localStorage.removeItem('user_id')
          reject(err)
        })
      })
    },
    redirect({ commit }, redirectData) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        // Make request to the back
        Vue.http.post(`${process.env.VUE_APP_SERVICE_URL}/microsoft/login`, {
          ...redirectData
          })
          .then(res => {
            const payload = {
              first_name: res.data.first_name,
              last_name: res.data.last_name
            }
            //Set the response to the local storage
            localStorage.setItem('accessToken', res.data.access_token)
            localStorage.setItem('email', res.data.email)
            localStorage.setItem('isAdmin', res.data.isAdmin)
            localStorage.setItem('user_id', res.data.id)
            var permissionList = []
              res.data.permissions.forEach(item => {
                permissionList.push(item.name)
              })
              localStorage.setItem('permissions', permissionList)
            commit('auth_success',res.data.access_token)
            commit('setName', payload)
            resolve(res)
          })
          .catch(err => {
            commit('auth_error')
            localStorage.removeItem('accessToken')
            localStorage.removeItem('email')
            localStorage.removeItem('isAdmin')
            localStorage.removeItem('permissions')
            localStorage.removeItem('user_id')
            reject(err)
          })
      })
    },
    logoutNoToken({ commit }) {
      return new Promise((resolve, reject) => {
              localStorage.removeItem('accessToken')
              localStorage.removeItem('email')
              localStorage.removeItem('name')
              localStorage.removeItem('isAdmin')
              localStorage.removeItem('user_id')
              localStorage.removeItem('permissions')
              resolve()
      })
    },
    logout({ commit }) {
      return new Promise((resolve, reject) => {
          
      Vue.http.get(`${process.env.VUE_APP_SERVICE_URL}/logout`, {headers: {accept: 'application/json', Authorization: `Bearer ${localStorage.getItem('accessToken')}`}})
          .then(res => {
              commit('logout')
              // localStorage.removeItem('token')
              localStorage.removeItem('accessToken')
              localStorage.removeItem('email')
              localStorage.removeItem('name')
              localStorage.removeItem('isAdmin')
              localStorage.removeItem('user_id')
              localStorage.removeItem('permissions')
              resolve()
          }).catch(err => {
              localStorage.removeItem('accessToken')
              localStorage.removeItem('email')
              localStorage.removeItem('name')
              localStorage.removeItem('isAdmin')
              localStorage.removeItem('user_id')
              localStorage.removeItem('permissions')
              reject(err)
          })
      })
    },
  },

  getters: {
    isLoggedIn: state => checkLoginStatus(state)
  }
})
