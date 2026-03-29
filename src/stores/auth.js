import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import { authAPI } from '@/api/modules/auth.js'
import { 
  getAccessToken, 
  setAccessToken, 
  setRefreshToken,
  getRefreshToken,
  removeToken, 
  isAccessTokenExpired,
  hasRefreshToken,
  getUserRoleFromToken 
} from '@/utils/auth.js'

// 从 localStorage 恢复用户信息
const getStoredUser = () => {
  try {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

// 从 localStorage 恢复权限信息
const getStoredPermissions = () => {
  try {
    const stored = localStorage.getItem('permissions')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: getAccessToken(),
    refreshToken: getRefreshToken(),
    user: getStoredUser(),
    permissions: getStoredPermissions(),
    isLoading: false
  }),

  getters: {
    isLoggedIn: (state) => !!state.token && !isAccessTokenExpired(),
    hasPermission: (state) => (permission) => {
      // 管理员拥有所有权限
      if (state.user?.role === 'ADMIN' || state.user?.role === 'ROLE_ADMIN') {
        return true
      }
      return state.permissions.includes(permission) || state.permissions.includes('*')
    },
    userRole: (state) => {
      // 如果用户未加载，尝试从token获取角色
      if (!state.user && state.token) {
        const tokenRole = getUserRoleFromToken()
        console.log('从token获取角色:', tokenRole)
        return tokenRole || 'USER'
      }
      const role = state.user?.role || 'USER'
      console.log('AuthStore userRole:', role, 'User:', state.user)
      return role
    },
    isAdmin: (state) => state.user?.role === 'ADMIN',
    isOrg: (state) => state.user?.role === 'ORG',
    isUser: (state) => state.user?.role === 'USER'
  },

  actions: {
// 登录
    async login(credentials) {
      try {
        this.isLoading = true
        const response = await authAPI.login(credentials)

        console.log('登录接口完整响应:', response)

        // 响应拦截器已经处理了，response 格式为 { code, message, data }
        // response.data 才是真正的业务数据
        const loginData = response.data

        if (!loginData || !loginData.token) {
          throw new Error('登录返回数据异常')
        }

        console.log('登录数据:', loginData)

        // 解构登录数据
        const { token, refreshToken } = loginData
        const user = loginData.user

        if (!user) {
          throw new Error('用户信息缺失')
        }

        // 保存到 state
        this.token = token
        this.refreshToken = refreshToken

        // 保存到 localStorage
        setAccessToken(token)
        setRefreshToken(refreshToken)

        // 设置用户信息
        this.user = {
          id: user.id,
          username: user.username,
          role: user.role,
          avatar: user.avatar,
          orgStatus: user.orgStatus,
          orgProfileComplete: user.orgProfileComplete
        }

        // 转换权限格式：将 ROLE_ORG, ROLE_ADMIN 等转换为具体的权限列表
        this.permissions = this.convertPermissions(user.permissions || user.authorities || [])

        // 确保管理员拥有所有权限
        if (user.role === 'ADMIN' || user.role === 'ROLE_ADMIN') {
          this.permissions = ['*']
        }

        // 持久化用户信息和权限到 localStorage
        localStorage.setItem('user', JSON.stringify(this.user))
        localStorage.setItem('permissions', JSON.stringify(this.permissions))

        console.log('登录成功，用户信息:', this.user)
        console.log('当前角色:', this.user?.role)

        return loginData
      } catch (error) {
        console.error('登录失败:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

// 注册
    async register(userData) {
      try {
        this.isLoading = true
        const response = await authAPI.register(userData)

        console.log('注册响应:', response)

        // 响应拦截器已经处理了，response 格式为 { code, message, data }
        const registerData = response.data

        console.log('注册数据:', registerData)

        // 注册成功返回用户信息，但没有token，需要提示用户登录
        if (registerData?.userId) {
          ElMessage.success('注册成功，请登录')
        }

        return registerData
      } catch (error) {
        console.error('注册失败:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // 退出登录
    async logout() {
      try {
        await authAPI.logout()
      } catch (error) {
        console.error('退出登录请求失败:', error)
      } finally {
        this.token = ''
        this.refreshToken = ''
        this.user = null
        this.permissions = []
        removeToken()

        // 清除持久化的用户信息和权限
        localStorage.removeItem('user')
        localStorage.removeItem('permissions')

        // 跳转到登录页
        window.location.href = '/login'
      }
    },

// 获取当前用户信息
    async getCurrentUser() {
      try {
        const response = await authAPI.getCurrentUser()

        console.log('获取用户信息响应:', response)

        // 响应拦截器已经处理了，response 格式为 { code, message, data }
        const userData = response.data

        console.log('用户数据:', userData)

        const user = userData

        this.user = {
          id: user.id,
          username: user.username,
          role: user.role,
          avatar: user.avatar,
          phone: user.phone,
          email: user.email,
          status: user.status,
          createTime: user.createTime,
          orgStatus: user.orgStatus,
          orgProfileComplete: user.orgProfileComplete
        }
        // 转换权限格式（ROLE_ORG -> 具体权限列表）
        this.permissions = this.convertPermissions(user.permissions || [])

        // 持久化用户信息和权限到 localStorage
        localStorage.setItem('user', JSON.stringify(this.user))
        localStorage.setItem('permissions', JSON.stringify(this.permissions))

        console.log('用户信息更新成功:', this.user)

        return userData
      } catch (error) {
        // 【修复】不要自动登出，只在 token 真正过期时才登出
        // 可能是网络问题或接口不存在，不应该清除已登录状态
        console.error('获取当前用户信息失败:', error)
        // 如果是认证错误（401），才调用 logout
        if (error.response?.status === 401 || error.code === 1001) {
          this.logout()
        }
        throw error
      }
    },

    // 更新个人资料
    async updateProfile(profileData) {
      try {
        const response = await authAPI.updateProfile(profileData)
        
        if (this.user) {
          this.user = {
            ...this.user,
            ...profileData
          }
        }
        
        return response.data
      } catch (error) {
        throw error
      }
    },

// 刷新token
    async refreshAccessToken() {
      try {
        const refreshTokenValue = getRefreshToken()
        if (!refreshTokenValue) {
          throw new Error('No refresh token available')
        }

        const response = await authAPI.refreshToken(refreshTokenValue)

        console.log('刷新token响应:', response)

        // 响应拦截器已经处理了，response 格式为 { code, message, data }
        const tokenData = response.data

        const { token, refreshToken: newRefreshToken } = tokenData

        this.token = token
        this.refreshToken = newRefreshToken
        setAccessToken(token)
        setRefreshToken(newRefreshToken)

        console.log('Token刷新成功')

        return tokenData
      } catch (error) {
        console.error('刷新token失败:', error)
        this.logout()
        throw error
      }
    },

    // 检查是否需要刷新token
    async checkAndRefreshToken() {
      if (isAccessTokenExpired() && hasRefreshToken()) {
        try {
          await this.refreshAccessToken()
          return true
        } catch (error) {
          return false
        }
      }
      return true
    },

    // 检查权限
    checkPermission(permission) {
      console.log('权限检查:', { permission, userRole: this.userRole, permissions: this.permissions, isAdmin: this.isAdmin })
      return this.hasPermission(permission)
    },

// 初始化用户信息（页面刷新时调用）
    async initUserInfo() {
      // 检查 token 是否过期
      if (this.token && isAccessTokenExpired()) {
        console.log('Token 已过期，清除登录状态')
        this.token = ''
        this.refreshToken = ''
        this.user = null
        this.permissions = []
        removeToken()
        // 清除持久化的用户信息和权限
        localStorage.removeItem('user')
        localStorage.removeItem('permissions')
        throw new Error('Token expired')
      }

      if (this.token && !this.user) {
        try {
          console.log('初始化用户信息，token存在但user为null')
          await this.getCurrentUser()
          console.log('用户信息初始化完成:', this.user)
        } catch (error) {
          console.error('初始化用户信息失败:', error)
          // 清除无效的登录状态
          this.token = ''
          this.refreshToken = ''
          this.user = null
          this.permissions = []
          removeToken()
          // 清除持久化的用户信息和权限
          localStorage.removeItem('user')
          localStorage.removeItem('permissions')
          throw error
        }
      } else if (this.token && this.user) {
        console.log('用户信息已存在:', this.user)
      } else if (!this.token) {
        console.log('无token，用户未登录')
      }
    },

    // 转换权限格式
    convertPermissions(rolePermissions) {
      const permissionMap = {
        'ROLE_ADMIN': [
          'admin:access',
          'admin:user:list',
          'admin:user:create',
          'admin:user:edit',
          'admin:user:delete',
          'admin:org:list',
          'admin:org:create',
          'admin:org:edit',
          'admin:org:delete',
          'admin:statistics:view',
          '*'
        ],
        'ROLE_ORG': [
          'org:access',
          'org:pet:list',
          'org:pet:create',
          'org:pet:edit',
          'org:adoption:list',
          'org:adoption:view',
          'org:followup:list',
          'org:profile:edit',
          'org:statistics:view'
        ],
        'ROLE_USER': [
          'user:access',
          'user:pet:list',
          'user:pet:view',
          'user:application:list',
          'user:application:create',
          'user:application:view',
          'user:application:cancel',
          'user:profile:edit'
        ]
      }

      let permissions = []

      // 如果已经包含具体权限，直接使用
      if (rolePermissions.length > 0 && !rolePermissions.some(p => p.startsWith('ROLE_'))) {
        return rolePermissions
      }

      // 将角色权限转换为具体权限
      rolePermissions.forEach(role => {
        if (permissionMap[role]) {
          permissions = [...permissions, ...permissionMap[role]]
        }
      })

      console.log('转换权限 - 角色:', rolePermissions, '-> 具体权限:', permissions)
      return permissions
    }
  }
})
