// 本地存储工具类
class Storage {
  constructor() {
    this.prefix = 'pet_adoption_'
  }

  // 设置存储项
  set(key, value, expire = null) {
    const item = {
      value,
      timestamp: Date.now()
    }
    
    if (expire) {
      item.expire = expire * 1000 // 转换为毫秒
    }
    
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(item))
    } catch (error) {
      console.error('存储失败:', error)
      // 存储空间不足时清理过期数据
      this.clearExpired()
      // 重试一次
      try {
        localStorage.setItem(this.prefix + key, JSON.stringify(item))
      } catch (retryError) {
        console.error('存储重试失败:', retryError)
      }
    }
  }

  // 获取存储项
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(this.prefix + key)
      if (!item) return defaultValue

      const parsedItem = JSON.parse(item)
      
      // 检查是否过期
      if (parsedItem.expire && Date.now() > parsedItem.timestamp + parsedItem.expire) {
        this.remove(key)
        return defaultValue
      }
      
      return parsedItem.value
    } catch (error) {
      console.error('读取存储失败:', error)
      return defaultValue
    }
  }

  // 移除存储项
  remove(key) {
    try {
      localStorage.removeItem(this.prefix + key)
    } catch (error) {
      console.error('移除存储失败:', error)
    }
  }

  // 清空所有存储
  clear() {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith(this.prefix))
      keys.forEach(key => localStorage.removeItem(key))
    } catch (error) {
      console.error('清空存储失败:', error)
    }
  }

  // 清理过期数据
  clearExpired() {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith(this.prefix))
      const now = Date.now()
      
      keys.forEach(key => {
        try {
          const item = JSON.parse(localStorage.getItem(key))
          if (item && item.expire && now > item.timestamp + item.expire) {
            localStorage.removeItem(key)
          }
        } catch (error) {
          // 解析失败的项也清理掉
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.error('清理过期数据失败:', error)
    }
  }

  // 获取存储大小（估算）
  getSize() {
    try {
      let size = 0
      const keys = Object.keys(localStorage).filter(key => key.startsWith(this.prefix))
      keys.forEach(key => {
        size += localStorage.getItem(key).length
      })
      return (size / 1024).toFixed(2) + ' KB'
    } catch (error) {
      return '0 KB'
    }
  }
}

// 导出单例
export const storage = new Storage()

// 便捷方法
export const setStorage = (key, value, expire) => storage.set(key, value, expire)
export const getStorage = (key, defaultValue) => storage.get(key, defaultValue)
export const removeStorage = (key) => storage.remove(key)
export const clearStorage = () => storage.clear()

// 常用存储键名
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  SEARCH_HISTORY: 'search_history',
  BROWSER_HISTORY: 'browser_history',
  APP_SETTINGS: 'app_settings',
  LOCATION_CACHE: 'location_cache',
  PET_FILTERS: 'pet_filters'
}