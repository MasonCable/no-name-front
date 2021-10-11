import VueRouter from "vue-router"
import Router from 'vue-router'
import Vue from 'vue'
import routes from "./routes"

Vue.use(Router)

// configure router
const router = new VueRouter({
  mode: 'history',
  routes, // short for routes: routes
  linkExactActiveClass: "active",
  scrollBehavior: (to) => {
    if (to.hash) {
      return {selector: to.hash}
    } else {
      return { x: 0, y: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
	if(to.matched.some(record => record.meta.requiresAuth)){
		if(localStorage.getItem('access_token') == null){
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
