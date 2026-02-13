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
        
        // response.data 是 API 返回的完整 JSON：{ code, message, data: {...} }
        // response.data.data 才是具体的登录数据
        const loginData = response.data
        
        const { accessToken, refreshToken, permissions, userId, username, role, avatar } = loginData
        
        // 保存token
        this.token = accessToken
        this.refreshToken = refreshToken
        setAccessToken(accessToken)
        setRefreshToken(refreshToken)
        
        // 设置用户信息
        this.user = {
          id: userId,
          username: username,
          role: role,
          avatar: avatar,
          permissions: permissions || []
        }
        this.permissions = permissions || []
        
        return loginData
      } catch (error) {
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
        
        const userData_response = response.data
        
        // 注册成功返回用户信息，但没有token，需要提示用户登录
        if (userData_response?.id) {
          ElMessage.success('注册成功，请登录')
        }
        
        return userData_response
      } catch (error) {
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
        const userData = response.data
        
        const { userId, username, role, avatar, phone, email, status, createTime, permissions } = userData
        
        this.user = {
          id: userId,
          username: username,
          role: role,
          avatar: avatar,
          phone: phone,
          email: email,
          status: status,
          createTime: createTime,
          permissions: permissions || []
        }
        this.permissions = permissions || []
        
        return userData
      } catch (error) {
        this.logout()
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
        const tokenData = response.data
        
        const { accessToken, refreshToken: newRefreshToken } = tokenData
        
        this.token = accessToken
        this.refreshToken = newRefreshToken
        setAccessToken(accessToken)
        setRefreshToken(newRefreshToken)
        
        return tokenData
      } catch (error) {
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
    }
  }
})
