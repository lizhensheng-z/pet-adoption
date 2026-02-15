import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { 
  addFavorite, 
  removeFavorite, 
  toggleFavorite, 
  checkFavoriteStatus 
} from '@/api/modules/favorite.js'

/**
 * 收藏状态管理Hook
 * @param {number} petId - 宠物ID
 * @returns {Object} 收藏状态管理对象
 */
export function useFavorite(petId) {
  const authStore = useAuthStore()
  const router = useRouter()
  
  const isFavorited = ref(false)
  const loading = ref(false)
  const checking = ref(false)

  /**
   * 检查收藏状态
   */
  const checkStatus = async () => {
    if (!authStore.isLoggedIn) {
      isFavorited.value = false
      return
    }

    checking.value = true
    try {
      const { data } = await checkFavoriteStatus(petId)
      isFavorited.value = data.favorited
    } catch (error) {
      console.error('检查收藏状态失败:', error)
      isFavorited.value = false
    } finally {
      checking.value = false
    }
  }

  /**
   * 添加收藏
   */
  const addToFavorites = async () => {
    if (!authStore.isLoggedIn) {
      ElMessage.warning('请先登录')
      router.push('/login')
      return { success: false, needLogin: true }
    }

    loading.value = true
    try {
      await addFavorite(petId)
      isFavorited.value = true
      ElMessage.success('收藏成功')
      return { success: true, favorited: true }
    } catch (error) {
      console.error('收藏失败:', error)
      ElMessage.error('收藏失败，请稍后重试')
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * 取消收藏
   */
  const removeFromFavorites = async () => {
    if (!authStore.isLoggedIn) {
      ElMessage.warning('请先登录')
      router.push('/login')
      return { success: false, needLogin: true }
    }

    loading.value = true
    try {
      await removeFavorite(petId)
      isFavorited.value = false
      ElMessage.success('已取消收藏')
      return { success: true, favorited: false }
    } catch (error) {
      console.error('取消收藏失败:', error)
      ElMessage.error('取消收藏失败，请稍后重试')
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * 切换收藏状态
   */
  const toggleFavorite = async () => {
    if (!authStore.isLoggedIn) {
      ElMessage.warning('请先登录')
      router.push('/login')
      return { success: false, needLogin: true }
    }

    loading.value = true
    try {
      const { data } = await toggleFavorite(petId)
      isFavorited.value = data.favorited
      ElMessage.success(data.message)
      return { success: true, favorited: data.favorited }
    } catch (error) {
      console.error('切换收藏失败:', error)
      ElMessage.error('操作失败，请稍后重试')
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  return {
    isFavorited: computed(() => isFavorited.value),
    loading: computed(() => loading.value),
    checking: computed(() => checking.value),
    checkStatus,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite
  }
}

/**
 * 收藏列表管理Hook
 * @returns {Object} 收藏列表管理对象
 */
export function useFavoritesList() {
  const authStore = useAuthStore()
  const favorites = ref([])
  const loading = ref(false)
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(12)

  /**
   * 获取收藏列表
   */
  const loadFavorites = async (params = {}) => {
    if (!authStore.isLoggedIn) {
      favorites.value = []
      total.value = 0
      return
    }

    loading.value = true
    try {
      const queryParams = {
        pageNo: currentPage.value,
        pageSize: pageSize.value,
        ...params
      }
      
      const { data } = await getMyFavorites(queryParams)
      favorites.value = data.list || []
      total.value = data.total || 0
    } catch (error) {
      console.error('获取收藏列表失败:', error)
      favorites.value = []
      total.value = 0
    } finally {
      loading.value = false
    }
  }

  /**
   * 刷新收藏列表
   */
  const refreshFavorites = () => {
    currentPage.value = 1
    loadFavorites()
  }

  /**
   * 从收藏列表中移除
   */
  const removeFromList = (petId) => {
    const index = favorites.value.findIndex(item => item.petId === petId)
    if (index > -1) {
      favorites.value.splice(index, 1)
      total.value--
    }
  }

  return {
    favorites: computed(() => favorites.value),
    loading: computed(() => loading.value),
    total: computed(() => total.value),
    currentPage: computed(() => currentPage.value),
    pageSize: computed(() => pageSize.value),
    loadFavorites,
    refreshFavorites,
    removeFromList
  }
}

/**
 * 批量收藏状态管理Hook
 * @returns {Object} 批量收藏状态管理对象
 */
export function useBatchFavorites() {
  const authStore = useAuthStore()
  const favoriteStatusMap = ref(new Map())
  const loadingMap = ref(new Map())

  /**
   * 批量检查收藏状态
   */
  const checkBatchStatus = async (petIds) => {
    if (!authStore.isLoggedIn || !petIds || petIds.length === 0) {
      return
    }

    try {
      // 这里可以优化为批量API调用，如果后端支持
      const promises = petIds.map(async (petId) => {
        try {
          const { data } = await checkFavoriteStatus(petId)
          favoriteStatusMap.value.set(petId, data.favorited)
        } catch (error) {
          console.error(`检查宠物${petId}收藏状态失败:`, error)
          favoriteStatusMap.value.set(petId, false)
        }
      })

      await Promise.all(promises)
    } catch (error) {
      console.error('批量检查收藏状态失败:', error)
    }
  }

  /**
   * 获取收藏状态
   */
  const getFavoriteStatus = (petId) => {
    return computed(() => favoriteStatusMap.value.get(petId) || false)
  }

  /**
   * 获取加载状态
   */
  const getLoadingStatus = (petId) => {
    return computed(() => loadingMap.value.get(petId) || false)
  }

  /**
   * 设置加载状态
   */
  const setLoadingStatus = (petId, status) => {
    loadingMap.value.set(petId, status)
  }

  return {
    checkBatchStatus,
    getFavoriteStatus,
    getLoadingStatus,
    setLoadingStatus,
    favoriteStatusMap: computed(() => favoriteStatusMap.value),
    loadingMap: computed(() => loadingMap.value)
  }
}