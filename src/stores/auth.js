import { defineStore } from 'pinia'
import { authAPI } from '@/api/modules/auth.js'
import { getToken, setToken, removeToken } from '@/utils/auth.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: getToken(),
    user: null,
    permissions: [],
    isLoading: false
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    hasPermission: (state) => (permission) => {
      return state.permissions.includes(permission) || state.permissions.includes('*')
    },
    userRole: (state) => state.user?.role || 'user'
  },

  actions: {
    // 登录
    async login(credentials) {
      try {
        this.isLoading = true
        const { data } = await authAPI.login(credentials)
        
        // 保存token
        this.token = data.token
        setToken(data.token)
        
        // 获取用户信息
        await this.getUserInfo()
        
        return data
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
        const { data } = await authAPI.register(userData)
        
        // 保存token
        this.token = data.token
        setToken(data.token)
        
        // 获取用户信息
        await this.getUserInfo()
        
        return data
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
        this.user = null
        this.permissions = []
        removeToken()
        
        // 跳转到登录页
        window.location.href = '/login'
      }
    },

    // 获取用户信息
    async getUserInfo() {
      try {
        const { data } = await authAPI.getUserInfo()
        this.user = data.user
        this.permissions = data.permissions || []
        return data
      } catch (error) {
        this.logout()
        throw error
      }
    },

    // 刷新token
    async refreshToken() {
      try {
        const { data } = await authAPI.refreshToken()
        this.token = data.token
        setToken(data.token)
        return data
      } catch (error) {
        this.logout()
        throw error
      }
    },

    // 检查权限
    checkPermission(permission) {
      return this.hasPermission(permission)
    }
  }
})