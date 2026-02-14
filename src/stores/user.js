import { defineStore } from 'pinia'
import { userAPI } from '@/api/modules/auth.js'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
    preferences: null,
    creditInfo: null,
    favorites: [],
    applications: [],
    checkins: []
  }),

  getters: {
    fullName: (state) => {
      if (!state.userInfo) return ''
      return `${state.userInfo.lastName}${state.userInfo.firstName}`
    },
    
    avatar: (state) => state.userInfo?.avatar || '',
    
    isCompleteProfile: (state) => {
      if (!state.userInfo) return false
      return !!(
        state.userInfo.phone &&
        state.userInfo.email &&
        state.userInfo.address
      )
    },

    favoritePets: (state) => state.favorites.map(fav => fav.pet),
    
    pendingApplications: (state) => state.applications.filter(app => app.status === 'pending')
  },

  actions: {
    // 获取用户详细信息（含信用分、统计数据、徽章等）
    async getUserProfile() {
      try {
        const response = await userAPI.getUserProfile()
        this.userInfo = response.data
        return response.data
      } catch (error) {
        throw error
      }
    },

    // 获取用户统计数据
    async getUserStats() {
      try {
        const { data } = await userAPI.getUserStats()
        return data
      } catch (error) {
        throw error
      }
    },

    // 获取用户偏好设置
    async getPreferences() {
      try {
        const { data } = await userAPI.getPreference()
        this.preferences = data
        return data
      } catch (error) {
        throw error
      }
    },

    // 更新偏好设置
    async updatePreferences(preferences) {
      try {
        const { data } = await userAPI.updatePreference(preferences)
        this.preferences = { ...this.preferences, ...data }
        return data
      } catch (error) {
        throw error
      }
    },

    // 更新用户信息
    async updateUserInfo(userInfo) {
      try {
        const { data } = await userAPI.updateUser(this.userInfo.id, userInfo)
        this.userInfo = { ...this.userInfo, ...data }
        return data
      } catch (error) {
        throw error
      }
    },

    // 添加收藏
    addFavorite(pet) {
      const exists = this.favorites.find(fav => fav.petId === pet.id)
      if (!exists) {
        this.favorites.push({
          petId: pet.id,
          pet,
          createdAt: new Date().toISOString()
        })
      }
    },

    // 移除收藏
    removeFavorite(petId) {
      const index = this.favorites.findIndex(fav => fav.petId === petId)
      if (index > -1) {
        this.favorites.splice(index, 1)
      }
    },

    // 添加申请
    addApplication(application) {
      this.applications.unshift(application)
    },

    // 更新申请状态
    updateApplicationStatus(applicationId, status) {
      const application = this.applications.find(app => app.id === applicationId)
      if (application) {
        application.status = status
        application.updatedAt = new Date().toISOString()
      }
    },

    // 添加打卡
    addCheckin(checkin) {
      this.checkins.unshift(checkin)
    },

    // 设置用户信息
    setUserInfo(userInfo) {
      this.userInfo = userInfo
    },

    // 设置信用信息
    setCreditInfo(creditInfo) {
      this.creditInfo = creditInfo
    },

    // 清空用户数据
    clearUserData() {
      this.userInfo = null
      this.preferences = null
      this.creditInfo = null
      this.favorites = []
      this.applications = []
      this.checkins = []
    }
  }
})