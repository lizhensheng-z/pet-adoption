import { createRouter, createWebHistory } from 'vue-router'
import userRoutes from './user.js'
import orgRoutes from './org.js'
import adminRoutes from './admin.js'
import { getToken } from '@/utils/auth.js'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  ...userRoutes,
  ...orgRoutes,
  ...adminRoutes,
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = getToken()
  
  // 需要认证的页面
  if (to.meta.requiresAuth && !token) {
    next('/login')
    return
  }
  
  // 需要特定权限的页面
  if (to.meta.permission && token) {
    // TODO: 检查用户权限
    // const userStore = useUserStore()
    // if (!userStore.hasPermission(to.meta.permission)) {
    //   next('/403')
    //   return
    // }
  }
  
  next()
})

export default router