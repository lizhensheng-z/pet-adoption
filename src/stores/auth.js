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
  hasRefreshToken 
} from '@/utils/auth.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: getAccessToken(),
    refreshToken: getRefreshToken(),
    user: null,
    permissions: [],
    isLoading: false
  }),

  getters: {
    isLoggedIn: (state) => !!state.token && !isAccessTokenExpired(),
    hasPermission: (state) => (permission) => {
      return state.permissions.includes(permission) || state.permissions.includes('*')
    },
    userRole: (state) => state.user?.role || 'USER',
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

        if (!loginData || !loginData.accessToken) {
          throw new Error('登录返回数据异常')
        }

        console.log('登录数据:', loginData)

        // 解构登录数据（注意：后端返回的是 userId）
        const { accessToken, refreshToken, permissions, userId, username, role, avatar } = loginData

        // 保存到 state
        this.token = accessToken
        this.refreshToken = refreshToken

        // 保存到 localStorage
        setAccessToken(accessToken)
        setRefreshToken(refreshToken)

// 设置用户信息（使用 userId 字段）
        this.user = {
          id: userId,
          username: username,
          role: role,
          avatar: avatar
        }

        // 转换权限格式：将 ROLE_ORG, ROLE_ADMIN 等转换为具体的权限列表
        this.permissions = this.convertPermissions(permissions || [])

        console.log('登录成功，用户信息:', this.user)
        console.log('当前角色:', role)

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

        // 解构用户数据（注意：后端返回的是 userId）
        const { userId, username, role, avatar, phone, email, status, createTime, permissions } = userData

        this.user = {
          id: userId,
          username: username,
          role: role,
          avatar: avatar,
          phone: phone,
          email: email,
          status: status,
          createTime: createTime
        }
        this.permissions = permissions || []

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
    async refreshToken() {
      try {
        const refreshToken = getRefreshToken()
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        const response = await authAPI.refreshToken(refreshToken)

        console.log('刷新token响应:', response)

        // 响应拦截器已经处理了，response 格式为 { code, message, data }
        const tokenData = response.data

        const { accessToken, refreshToken: newRefreshToken } = tokenData

        this.token = accessToken
        this.refreshToken = newRefreshToken
        setAccessToken(accessToken)
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
          await this.refreshToken()
          return true
        } catch (error) {
          return false
        }
      }
      return true
    },

    // 检查权限
    checkPermission(permission) {
      return this.hasPermission(permission)
    },

// 初始化用户信息（页面刷新时调用）
    async initUserInfo() {
      if (this.token && !this.user) {
        try {
          await this.getCurrentUser()
        } catch (error) {
          console.error('初始化用户信息失败:', error)
        }
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
