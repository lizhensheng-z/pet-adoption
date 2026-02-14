import { createRouter, createWebHistory } from 'vue-router'
import userRoutes from './user.js'
import orgRoutes from './org.js'
import adminRoutes from './admin.js'
import { getToken } from '@/utils/auth.js'
import AppLayout from '@/components/layout/AppLayout.vue' // 确保路径正确

const routes = [
  {
    path: '/',
    component: AppLayout,
    redirect: '/home',
    children: [
      // 这里的路由会自动渲染到 AppLayout 的 <router-view /> 中
      ...userRoutes.filter(r => !['Login', 'Register'].includes(r.name)),
      ...orgRoutes,
      ...adminRoutes
    ]
  },
  // 登录和注册不需要 AppLayout 的包装
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/user/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/user/Register.vue'),
    meta: { title: '注册' }
  },
  // 404 路由放在最后
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

// 路由守卫优化
router.beforeEach(async (to, from, next) => {
  const token = getToken()

  // 1. 如果去的是需要登录的页面但没 token
  if (to.meta.requiresAuth && !token) {
    next('/login')
    return
  }

  // 2. 如果去的是登录页但已经有 token 了，检查是否是主动访问
  // 如果是从其他页面点击登录按钮，重定向到首页
  // 如果是直接访问 /login（比如刷新登录页），也重定向到首页
  if (to.path === '/login' && token) {
    console.log('检测到已登录用户访问登录页，重定向到首页')
    next('/home')
    return
  }

  next()
})

export default router
