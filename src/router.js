import Vue from 'vue'
import VueRouter from 'vue-router'

import jwtDecode from 'jwt-decode'
import Router from 'vue-router'
import AuthLayout from "@/layout/auth/AuthLayout.vue"
import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue"
// GeneralViews
import NotFound from "@/pages/NotFoundPage.vue"

// Admin pages
const Dashboard = () => import(/* webpackChunkName: "dashboard" */"@/pages/Dashboard.vue")
const Profile = () => import(/* webpackChunkName: "common" */ "@/pages/Profile.vue")
const Notifications = () => import(/* webpackChunkName: "common" */"@/pages/Notifications.vue")
const Icons = () => import(/* webpackChunkName: "common" */ "@/pages/Icons.vue")
const Maps = () => import(/* webpackChunkName: "common" */ "@/pages/Maps.vue")
const Typography = () => import(/* webpackChunkName: "common" */ "@/pages/Typography.vue")
const TableList = () => import(/* webpackChunkName: "common" */ "@/pages/TableList.vue")
const Login = () => import(/* webpackChunkName: "common" */ "@/pages/Auth/Login.vue")

Vue.use(Router)

const router = new VueRouter({
    mode : 'history',
    routes: [
      {
        path: '/auth',
        component: AuthLayout,
        children: [
          {
            name: 'Login',
            path: 'login',
            component: Login,
            meta: {
              noAuth: true
            }
          },
        ],
      },
      {
        path: "/",
        component: DashboardLayout,
        redirect: "/dashboard",
        children: [
          {
            path: "dashboard",
            name: "dashboard",
            component: Dashboard
          },
          {
            path: "profile",
            name: "profile",
            component: Profile
          },
          {
            path: "notifications",
            name: "notifications",
            component: Notifications
          },
          {
            path: "icons",
            name: "icons",
            component: Icons
          },
          {
            path: "maps",
            name: "maps",
            component: Maps
          },
          {
            path: "typography",
            name: "typography",
            component: Typography
          },
          {
            path: "table-list",
            name: "table-list",
            component: TableList
          }
        ],
        meta: {
          requiresAuth: true
        }
      },
    
      { path: "*", component: NotFound },
    ],
    linkExactActiveClass: "active",
    scrollBehavior: (to) => {
      if (to.hash) {
        return {selector: to.hash}
      } else {
        return { x: 0, y: 0 }
      }
    }
})

const isValidToken = () => {
  var token = localStorage.getItem('jwt_token')
  if (!token) {
    return false
  }

  const decodedToken = jwtDecode(token)
  const currentTime = Date.now() / 1000
  
  return decodedToken.exp > currentTime
}

router.beforeEach((to, from, next) => {
	if(to.matched.some(record => record.meta.requiresAuth)){
		if(!isValidToken()){
			next('/auth/login')
      
		}
    else {
      next()
      
    }
	} else {
    next()
  }

})

export default router