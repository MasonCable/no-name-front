import Vue from 'vue';
import VueRouter from 'vue-router';
import Router from 'vue-router';
import DashboardLayout from '../layout/starter/SampleLayout.vue';
import Starter from '../layout/starter/SamplePage.vue';

Vue.use(Router);

const router = new VueRouter({
	mode: 'history',
	routes: [
		{
			path: '/',
			name: 'home',
			redirect: '/dashboard',
			component: DashboardLayout,
			children: [
			{
				path: 'dashboard',
				name: 'dashboard',
				components: { default: Starter }
			}
			]
		},
	]
})

router.beforeEach((to, next, from) => {
	if(to.matched.some(record => record.meta.requiresAuth)){
		if(localStorage.getItem('access_token') == null){
			next('/dashboard/profile')
		}
	}
})

export default router

// export default new Router({
//   routes: [
//     {
//       path: '/',
//       name: 'home',
//       redirect: '/dashboard',
//       component: DashboardLayout,
//       children: [
//         {
//           path: 'dashboard',
//           name: 'dashboard',
//           components: { default: Starter }
//         }
//       ]
//     }
//   ]


// });
