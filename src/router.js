import Vue from 'vue'
import Router from 'vue-router'
import store from './store'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,

  routes: [
    {
      path: '/pages',
      component: () => import('@/views/pages/Index'),
      children: [
        {
          name: 'Login',
          path: 'login',
          component: () => import('@/views/pages/Login'),
          meta: {
            noAuth: true
          }
        },
        {
          path: '/password-reset/:id',
          name: 'password-reset',
          component: () => import('@/views/pages/PasswordReset'),
          meta: {
            noAuth: true
          }
        },
        {
          path: '/forgot-password',
          name: 'ForgotPassword',
          component: () => import('@/views/pages/ForgotPassword'),
          meta: {
            noAuth: true
          }
        }
      ],
    },
    
    {
      name: 'Logout',
      path: '/logout',
      component: () => import('@/views/Logout'),
      meta:{
        requiresAuth: true
      }
    },
   
    {
      path: '/',
      component: () => import('@/views/dashboard/Index'),
      children: [
        // Dashboard
        {
          name: 'Editor Log Statistics',
          path: 'pages/statistics/order-type',
          component: () => import('@/views/dashboard/pages/statistics/OrderTypeStatistics'),          
        },
        {
          name: 'Order Type Statistics',
          path: 'pages/statistics/editor-logs',
          component: () => import('@/views/dashboard/pages/statistics/EditorLogStatistics'),          
        },
        {
          name: 'Schedule Statistics',
          path: 'pages/statistics/schedule',
          component: () => import('@/views/dashboard/pages/statistics/ScheduleStatistics'),          
        },
        {
          name: 'Client Statistics',
          path: 'pages/statistics/client',
          component: () => import('@/views/dashboard/pages/statistics/ClientStatistics'),          
        },
        {
          name: 'User Statistics',
          path: 'pages/statistics/user',
          component: () => import('@/views/dashboard/pages/statistics/UserStatistics'),          
        },
        {
          name: 'Employee Activity Summary',
          path: 'pages/statistics/employee-activity',
          component: () => import('@/views/dashboard/pages/statistics/EmployeeActivity'),          
        },
        {
          name: 'Account Manager Statistics',
          path: 'pages/statistics/account-manager',
          component: () => import('@/views/dashboard/pages/statistics/AmStatistics'),          
        },
        {
          name: 'Dashboard',
          path: '',
          component: () => import('@/views/dashboard/Dashboard'),
        },
        // Pages
        {
          name: 'Logs Create',
          path: 'pages/logs/create',
          component: () => import('@/views/dashboard/pages/editor-logs/NewCreateLog'),
        },
        {
          name: 'Editor Logs',
          path: 'pages/editor-logs',
          component: () => import('@/views/dashboard/pages/editor-logs/EditorLogsIndex'),
        },
        {
          name: 'Users Index',
          path: 'pages/users',
          component: () => import('@/views/dashboard/pages/UsersIndex'),
        },
        {
          name: 'User Profile',
          path: 'pages/user/profile',
          component: () => import('@/views/user/UserProfile')
        },      
        {
          name: 'User Account',
          path: 'pages/user/account',
          component: () => import('@/views/user/UserAccount')
        },
        {
          name: 'User Public View',
          path: 'pages/user/:id',
          component: () => import('@/views/user/UserView'),
         
        },
        {
          name: 'Project View',
          path: 'pages/project/:id',
          component: () => import('@/views/dashboard/pages/project/ProjectView')
        },
        {
          name: 'ProjectGroup View',
          path: 'pages/project-group/:id',
          component: () => import('@/views/dashboard/pages/project/ProjectGroupView')
        },
        {
          name: 'Projects Index',
          path: 'project',
          component: () => import('@/views/dashboard/pages/project/ProjectIndex')
        },
        {
          name: 'Projects Generator',
          path: 'client/generate/:id',
          component: () => import('@/views/dashboard/pages/project/GenerateProject')
        },
        {
          name: 'PermissionsIndex',
          path: 'admin/permissions',
          component: () => import('@/views/dashboard/pages/PermissionsIndex')
        },
        {
          name: 'RoleIndex',
          path: 'admin/roles',
          component: () => import('@/views/dashboard/pages/RolesIndex')
        },
        {
          name: 'Login Attempts',
          path: 'admin/login-attempts',
          component: () => import('@/views/dashboard/pages/LoginAttemptIndex')
        },
        {
          name: 'RoleView',
          path: '/pages/role/:id',
          component: () => import('@/views/dashboard/pages/RoleView')
        },
        {
          name: 'Clients Index',
          path: 'client',
          component: () => import('@/views/dashboard/pages/client/ClientIndex')
        },
        {
          name: 'Client View',
          path: 'client/:id',
          component: () => import('@/views/dashboard/pages/client/ClientView')
        },
        {
          name: 'Schedule Index',
          path: 'pages/schedule',
          component: () => import('@/views/dashboard/pages/schedule/ScheduleIndex')
        },
        {
          name: 'Daily Schedule',
          path: 'pages/daily-schedule',
          component: () => import('@/views/dashboard/pages/schedule/Daily/DailySchedule')
        },
        {
          name: 'Grid System',
          path: 'components/grid-system',
          component: () => import('@/views/dashboard/component/Grid'),
        },
       {
         name: 'Article View',
         path: 'pages/articles/:id',
         component: () => import('@/views/dashboard/pages/articles/ArticleView')
       }
      ],
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '*',
      component: () => import('@/views/pages/Index'),
      children: [
        {
          name: '404 Error',
          path: '',
          component: () => import('@/views/pages/Error'),
        },
      ],
    },
  ],
})


router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if(localStorage.getItem("accessToken") != null) {
        next()
        return
    }
    next('/pages/login')
   } 
  else if(to.matched.some(record => record.meta.noAuth)){
      if(localStorage.getItem('accessToken') == null) {
        next()
        return
      } 
      next('/')
  } 
  else {
    next()
  }
})


export default router
