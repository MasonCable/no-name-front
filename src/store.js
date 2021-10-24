import Vue from 'vue'
import Vuex from 'vuex'
import jwt from 'jsonwebtoken'
const JWT_SECRET = 'jwt_secret_key'
const JWT_VALIDITY = '7 days'

Vue.use(Vuex)


export default new Vuex.Store({
    state: {
        access_token: localStorage.getItem('access_token') || '',
        user_id: localStorage.getItem('user_id') || null,
        email: localStorage.getItem('email') || '',
        user_type: localStorage.getItem('user_type') || null,
        jwt_token: localStorage.getItem('jwt_token') || null,
        backHasAuth: false
    },

    mutations: {
        auth_request(state) {
            state.status = 'Loading'
          },
          auth_success(state,email,access_token) {
              state.access_token = access_token
              state.email = email
              
          },
          auth_error(state){
            state.status = 'error'
            state.isLoggedIn = false
          },

          storeToken(state) {
            const data = { web_token: localStorage.getItem('jwt_token') }
            console.log(localStorage.getItem('jwt_token'))
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
              };
            Vue.http.post(`${process.env.VUE_APP_SERVICE_URL}/users/storejwt`, {
                ...data
            }, {headers: headers})
                .then(res => {
                    console.log(res.data)
                    state.backHasAuth = true
                }).catch(err => console.log(err))
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
                    const apiToken = res.data.apiToken
                    const user = res.data.user
                    // console.log(user)
                    localStorage.setItem('access_token', apiToken)
                    localStorage.setItem('user_id', user.id)
                    localStorage.setItem('email', user.email)
                    localStorage.setItem('user_type', user.user_type)
                    const jwtToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
                        expiresIn: JWT_VALIDITY,
                    })
                    localStorage.setItem('jwt_token', jwtToken)
                    commit('auth_success', user.email, apiToken)
                    commit('storeToken')
                    resolve(res)
                })
                .catch(err => {
                    commit('auth_error')
                    localStorage.removeItem('access_token')
                    localStorage.removeItem('user_id')
                    localStorage.removeItem('email')
                    localStorage.removeItem('user_type')
                    localStorage.removeItem('jwt_token')
                    reject(err)
                })
            })
          }
      
    }
})