import { createRouter, createWebHistory } from 'vue-router'
import userRoutes from './user.js'
import orgRoutes from './org.js'
import adminRoutes from './admin.js'
import { getToken, getUserRoleFromToken } from '@/utils/auth.js'
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
  // 403 无权限页面
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('@/views/error/403.vue'),
    meta: { title: '无权限访问' }
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

  // 3. 权限检查
  if (to.meta.permission && token) {
    const userRole = getUserRoleFromToken()
    const requiredPermission = to.meta.permission
    
    // 检查用户角色和权限
    const hasPermission = checkUserPermission(userRole, requiredPermission)
    
    if (!hasPermission) {
      // 无权限，重定向到无权限页面或首页
      next('/403')
      return
    }
  }

  next()
})

// 权限检查函数
function checkUserPermission(userRole, requiredPermission) {
  if (!userRole || !requiredPermission) return false
  
  // 管理员拥有所有权限
  if (userRole === 'ADMIN' || userRole === 'ROLE_ADMIN') return true
  
  // 机构用户权限检查
  if (userRole === 'ORG' || userRole === 'ROLE_ORG') {
    const orgPermissions = [
      'org:access',
      'org:pet:list',
      'org:pet:create',
      'org:pet:edit',
      'org:adoption:list',
      'org:adoption:view',
      'org:followup:list',
      'org:profile:edit',
      'org:statistics:view'
    ]
    return orgPermissions.includes(requiredPermission)
  }
  
  // 普通用户权限检查
  if (userRole === 'USER' || userRole === 'ROLE_USER') {
    const userPermissions = [
      'user:access',
      'user:pet:list',
      'user:pet:view',
      'user:application:list',
      'user:application:create',
      'user:application:view',
      'user:application:cancel',
      'user:profile:edit'
    ]
    return userPermissions.includes(requiredPermission)
  }
  
  return false
}

export default router
