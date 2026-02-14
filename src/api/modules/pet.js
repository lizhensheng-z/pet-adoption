import http from '../request.js'

/**
 * 宠物相关API
 * 对应接口文档：宠物管理接口
 * 数据库表：pet, pet_media, pet_tag, tag, org_profile
 */

export const petAPI = {
  /**
   * 获取宠物列表
   * 接口：GET /api/pets
   * 权限：无需认证
   * 说明：支持多维度筛选、分页、排序、距离计算
   *
   * @param {Object} params - 查询参数
   * @param {string} params.keyword - 搜索关键词（宠物名称、品种）
   * @param {string} params.species - 物种：CAT/DOG/OTHER
   * @param {string} params.gender - 性别：MALE/FEMALE/UNKNOWN
   * @param {number} params.minAge - 最小年龄（月）
   * @param {number} params.maxAge - 最大年龄（月）
   * @param {string} params.size - 体型：S/M/L
   * @param {boolean} params.sterilized - 是否绝育
   * @param {boolean} params.vaccinated - 是否疫苗
   * @param {boolean} params.dewormed - 是否驱虫
   * @param {number} params.page - 页码（默认1）
   * @param {number} params.pageSize - 每页数量（默认12）
   * @param {string} params.sortBy - 排序字段：published_time/distance/match_score
   * @param {string} params.sortOrder - 排序方向：asc/desc
   * @param {number} params.lat - 用户纬度（用于距离计算）
   * @param {number} params.lng - 用户经度（用于距离计算）
   * @returns {Promise<{list: Pet[], total: number, pageNo: number, pageSize: number}>}
   */
  getPets(params) {
    return http.get('/pets', params)
  },

  /**
   * 获取宠物详情
   * 接口：GET /api/pets/{id}
   * 权限：无需认证
   * 说明：返回完整宠物信息，包括所有媒体文件和标签
   *
   * @param {number} id - 宠物ID
   * @returns {Promise<Pet>}
   */
  getPetDetail(id) {
    return http.get(`/pets/${id}`)
  },

  /**
   * 搜索宠物
   * 接口：GET /api/pets/search
   * 权限：无需认证
   * 说明：提供搜索建议和模糊搜索
   *
   * @param {string} keyword - 搜索关键词
   * @param {Object} params - 其他筛选参数（同getPets）
   * @returns {Promise<{list: Pet[], total: number, suggestions: string[]}>}
   */
  searchPets(keyword, params = {}) {
    return http.get('/pets/search', { keyword, ...params })
  },

  /**
   * 获取推荐宠物
   * 接口：GET /api/pets/recommended
   * 权限：需认证
   * 说明：基于用户偏好智能推荐，使用协同过滤算法
   *
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码（默认1）
   * @param {number} params.pageSize - 每页数量（默认12）
   * @param {number} params.lat - 用户纬度（用于距离权重）
   * @param {number} params.lng - 用户经度（用于距离权重）
   * @returns {Promise<{list: Pet[], total: number, pageNo: number, pageSize: number}>}
   */
  getRecommendedPets(params = {}) {
    return http.get('/pets/recommended', params)
  },

  /**
   * 获取附近宠物
   * 接口：GET /api/pets/nearby
   * 权限：无需认证
   * 说明：基于地理位置获取附近宠物
   *
   * @param {number} lat - 用户纬度
   * @param {number} lng - 用户经度
   * @param {number} radius - 搜索半径（km，默认10）
   * @param {Object} params - 其他筛选参数
   * @returns {Promise<{list: Pet[], total: number}>}
   */
  getNearbyPets(lat, lng, radius = 10, params = {}) {
    return http.get('/pets/nearby', { lat, lng, radius, ...params })
  },

  /**
   * 收藏/取消收藏宠物
   * 接口：POST /api/pets/{petId}/favorite
   * 权限：需认证 (favorite:manage)
   * 说明：切换收藏状态
   *
   * @param {number} petId - 宠物ID
   * @returns {Promise<{isFavorited: boolean}>}
   */
  toggleFavorite(petId) {
    return http.post(`/pets/${petId}/favorite`)
  },

  /**
   * 获取收藏列表
   * 接口：GET /api/pets/favorites
   * 权限：需认证 (favorite:manage)
   * 说明：获取当前用户的收藏列表
   *
   * @param {Object} params - 分页参数
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   * @returns {Promise<{list: Pet[], total: number, pageNo: number, pageSize: number}>}
   */
  getFavorites(params = {}) {
    return http.get('/pets/favorites', params)
  },

  /**
   * 获取搜索建议
   * 接口：GET /api/pets/suggest
   * 权限：无需认证
   * 说明：提供搜索建议（品种、宠物名、标签）
   *
   * @param {string} keyword - 搜索关键词
   * @returns {Promise<{breeds: string[], tags: string[], pets: string[]}>}
   */
  getSearchSuggestions(keyword) {
    return http.get('/pets/suggest', { keyword })
  }
}

// 领养申请相关API
export const applicationAPI = {
  // 提交领养申请
  createApplication(data) {
    return http.post('/applications', data)
  },

  // 获取申请列表
  getApplications(params) {
    return http.get('/applications', params)
  },

  // 获取申请详情
  getApplicationDetail(id) {
    return http.get(`/applications/${id}`)
  },

  // 更新申请状态
  updateApplicationStatus(id, status, data = {}) {
    return http.put(`/applications/${id}/status`, { status, ...data })
  },

  // 上传申请材料
  uploadApplicationMaterials(applicationId, formData) {
    return http.upload(`/applications/${applicationId}/materials`, formData)
  }
}