import http from '../request.js'

/**
 * 用户收藏管理API模块
 */

/**
 * 添加收藏
 * @param {number} petId - 宠物ID
 * @returns {Promise} 返回Promise对象
 */
export const addFavorite = (petId) => {
  return http.post(`/favorites/${petId}`)
}

/**
 * 取消收藏
 * @param {number} petId - 宠物ID
 * @returns {Promise} 返回Promise对象
 */
export const removeFavorite = (petId) => {
  return http.delete(`/favorites/${petId}`)
}

/**
 * 获取我的收藏列表
 * @param {Object} params - 查询参数
 * @param {number} params.pageNo - 页码，默认1
 * @param {number} params.pageSize - 每页条数，默认10
 * @returns {Promise} 返回Promise对象
 */
export const getMyFavorites = (params = {}) => {
  return http.get('/favorites/my', params)
}

/**
 * 收藏切换（收藏/取消收藏）
 * @param {number} petId - 宠物ID
 * @returns {Promise} 返回Promise对象
 */
export const toggleFavorite = (petId) => {
  return http.post('/favorites/toggle', { petId })
}

/**
 * 检查收藏状态
 * @param {number} petId - 宠物ID
 * @returns {Promise} 返回Promise对象
 */
export const checkFavoriteStatus = (petId) => {
  return http.get('/favorites/check', { petId })
}

/**
 * 收藏状态枚举
 */
export const FavoriteStatus = {
  FAVORITED: true,
  NOT_FAVORITED: false
}

/**
 * 宠物物种映射
 */
export const PetSpeciesMap = {
  CAT: '猫咪',
  DOG: '狗狗',
  OTHER: '其他'
}

/**
 * 性别映射
 */
export const GenderMap = {
  MALE: '男孩',
  FEMALE: '女孩',
  UNKNOWN: '未知'
}

/**
 * 体型映射
 */
export const SizeMap = {
  S: '小型',
  M: '中型',
  L: '大型'
}

/**
 * 格式化年龄显示
 * @param {number} ageMonth - 年龄（月）
 * @returns {string} 格式化后的年龄
 */
export const formatAge = (ageMonth) => {
  if (!ageMonth) return '未知'
  
  if (ageMonth < 12) {
    return `${ageMonth}个月`
  } else {
    const years = Math.floor(ageMonth / 12)
    const months = ageMonth % 12
    if (months === 0) {
      return `${years}岁`
    } else {
      return `${years}岁${months}个月`
    }
  }
}

/**
 * 格式化距离显示
 * @param {number} distance - 距离（公里）
 * @returns {string} 格式化后的距离
 */
export const formatDistance = (distance) => {
  if (!distance) return '未知'
  
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`
  } else {
    return `${distance.toFixed(1)}km`
  }
}