import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    // 侧边栏状态
    sidebarCollapsed: false,
    
    // 主题设置
    theme: 'light',
    
    // 页面设置
    pageSize: 10,
    
    // 地理位置信息
    location: {
      latitude: null,
      longitude: null,
      city: null,
      address: null
    },
    
    // 全局加载状态
    globalLoading: false,
    
    // 系统配置
    systemConfig: {
      siteName: '宠物领养平台',
      logoUrl: '',
      contactEmail: '',
      contactPhone: '',
      version: '1.0.0'
    },
    
    // 缓存数据
    cache: {
      petTags: [],
      cities: [],
      preferences: {}
    }
  }),

  getters: {
    isDarkTheme: (state) => state.theme === 'dark',
    
    currentCity: (state) => state.location.city || '未知城市',
    
    hasLocation: (state) => !!(state.location.latitude && state.location.longitude)
  },

  actions: {
    // 切换侧边栏
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },

    // 设置侧边栏状态
    setSidebarCollapsed(collapsed) {
      this.sidebarCollapsed = collapsed
    },

    // 切换主题
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
      this.applyTheme()
    },

    // 设置主题
    setTheme(theme) {
      this.theme = theme
      this.applyTheme()
    },

    // 应用主题
    applyTheme() {
      document.documentElement.setAttribute('data-theme', this.theme)
      localStorage.setItem('theme', this.theme)
    },

    // 设置页面大小
    setPageSize(size) {
      this.pageSize = size
      localStorage.setItem('pageSize', size.toString())
    },

    // 设置位置信息
    setLocation(location) {
      this.location = { ...this.location, ...location }
      localStorage.setItem('location', JSON.stringify(this.location))
    },

// 获取用户位置
    async getUserLocation() {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('浏览器不支持地理定位'))
          return
        }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords
            this.setLocation({ latitude, longitude })

            console.log('获取到GPS坐标:', latitude, longitude)

            // 调用高德地图逆地理编码API获取城市和地址信息
            try {
              const { MapUtils } = await import('@/utils/map.js')
              const addressInfo = await MapUtils.amap.reverseGeocode(latitude, longitude)

              console.log('逆地理编码结果:', addressInfo)

              if (addressInfo) {
                this.setLocation({
                  city: addressInfo.city,
                  address: addressInfo.formattedAddress,
                  province: addressInfo.province,
                  district: addressInfo.district,
                  street: addressInfo.street
                })
              }
            } catch (error) {
              console.error('获取地址信息失败:', error)
            }

            resolve(this.location)
          },
          (error) => {
            reject(new Error('获取位置失败: ' + error.message))
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5分钟缓存
          }
        )
      })
    },

    // 设置全局加载状态
    setGlobalLoading(loading) {
      this.globalLoading = loading
    },

    // 设置系统配置
    setSystemConfig(config) {
      this.systemConfig = { ...this.systemConfig, ...config }
    },

    // 设置缓存数据
    setCacheData(key, data) {
      this.cache[key] = data
    },

    // 获取缓存数据
    getCacheData(key) {
      return this.cache[key]
    },

    // 清除缓存
    clearCache(key = null) {
      if (key) {
        delete this.cache[key]
      } else {
        this.cache = {
          petTags: [],
          cities: [],
          preferences: {}
        }
      }
    },

    // 初始化应用设置
    initAppSettings() {
      // 恢复主题设置
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) {
        this.setTheme(savedTheme)
      }

      // 恢复页面大小设置
      const savedPageSize = localStorage.getItem('pageSize')
      if (savedPageSize) {
        this.pageSize = parseInt(savedPageSize)
      }

      // 恢复位置信息
      const savedLocation = localStorage.getItem('location')
      if (savedLocation) {
        try {
          this.location = JSON.parse(savedLocation)
        } catch (error) {
          console.error('解析位置信息失败:', error)
        }
      }
    }
  }
})