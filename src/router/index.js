import { createRouter, createWebHistory } from 'vue-router'
import userRoutes from './user.js'
import orgRoutes from './org.js'
import adminRoutes from './admin.js'
import { getToken, getUserRoleFromToken, isAccessTokenExpired, removeToken } from '@/utils/auth.js'
import { useAuthStore } from '@/stores/auth.js'
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
  const tokenExpired = token ? isAccessTokenExpired() : true

  // 1. 如果去的是需要登录的页面
  if (to.meta.requiresAuth) {
    // 没有 token 或 token 已过期，跳转登录页
    if (!token || tokenExpired) {
      // 清除过期的 token
      if (token && tokenExpired) {
        removeToken()
      }
      next('/login')
      return
    }
  }

  // 2. 如果去的是登录页但已经有有效 token
  if (to.path === '/login' && token && !tokenExpired) {
    console.log('检测到已登录用户访问登录页，重定向到首页')
    next('/home')
    return
  }

  // 3. 如果 token 过期但存在，清除并跳转登录页
  if (token && tokenExpired && !to.meta.noAuthRequired) {
    console.log('Token 已过期，清除并跳转登录页')
    removeToken()
    next('/login')
    return
  }

  // 4. 确保AuthStore用户状态同步
  if (token && !tokenExpired) {
    const authStore = useAuthStore()
    if (!authStore.user) {
      try {
        console.log('同步AuthStore用户状态...')
        await authStore.initUserInfo()
      } catch (error) {
        // 如果获取用户信息失败（可能是token无效），清除并跳转登录页
        console.error('获取用户信息失败:', error)
        removeToken()
        next('/login')
        return
      }
    }
  }

  // 5. 机构用户状态检查
  if (token && !tokenExpired && to.path.startsWith('/org/')) {
    const authStore = useAuthStore()
    const user = authStore.user

    if (user?.role === 'ORG') {
      // 检查机构状态
      switch (user.orgStatus) {
        case 'PENDING':
          // 只允许访问等待页面和资料页面
          if (!['/org/waiting', '/org/profile', '/org/profile/complete', '/org/profile/rejected'].includes(to.path)) {
            next('/org/waiting')
            return
          }
          break
        case 'REJECTED':
          // 只允许访问资料修改页面
          if (!['/org/profile/rejected', '/org/profile', '/org/waiting'].includes(to.path)) {
            next('/org/profile')
            return
          }
          break
        case undefined:
        case null:
          // 未完善资料，跳转到完善页面
          if (to.path !== '/org/profile/complete') {
            next('/org/profile/complete')
            return
          }
          break
      }
    }
  }

  // 5.5 限制管理员和机构用户访问普通用户的领养相关页面
  // 收藏、申请页面只对普通用户开放
  const userOnlyPaths = ['/favorites', '/applications', '/apply', '/checkins']
  const isUserOnlyPath = userOnlyPaths.some(p => to.path.startsWith(p))
  
  if (token && !tokenExpired && isUserOnlyPath) {
    const authStore = useAuthStore()
    const userRole = authStore.userRole
    
    // 管理员和机构用户禁止访问这些页面
    if (userRole === 'ADMIN' || userRole === 'ROLE_ADMIN' || 
        userRole === 'ORG' || userRole === 'ROLE_ORG') {
      console.log('管理员/机构用户禁止访问普通用户领养页面:', to.path)
      next('/home')
      return
    }
  }

  // 6. 权限检查
  if (to.meta.permission && token && !tokenExpired) {
    const userRole = getUserRoleFromToken()
    const requiredPermission = to.meta.permission

    console.log('=== 路由权限检查 ===')
    console.log('目标路径:', to.path)
    console.log('所需权限:', requiredPermission)
    console.log('从token获取的角色:', userRole)

    let hasPermission = false

    if (userRole === 'ADMIN' || userRole === 'ROLE_ADMIN') {
      hasPermission = true
      console.log('管理员权限通过')
    } else {
      hasPermission = checkUserPermission(userRole, requiredPermission)
      console.log('权限检查结果:', hasPermission)
    }

    console.log('===================')

    if (!hasPermission) {
      next('/403')
      return
    }
  }

  next()
})

// 权限检查函数
function checkUserPermission(userRole, requiredPermission) {
  if (!userRole || !requiredPermission) return false
  
  // 管理员拥有所有权限，包括用户端和管理端
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
