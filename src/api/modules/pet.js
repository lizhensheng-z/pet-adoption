import http from '../request.js'

// 宠物相关API
export const petAPI = {
  // 获取宠物列表（支持分页、筛选、排序）
  getPets(params) {
    return http.get('/pets', params)
  },

  // 获取宠物详情
  getPetDetail(id) {
    return http.get(`/pets/${id}`)
  },

  // 搜索宠物
  searchPets(keyword, params = {}) {
    return http.get('/pets/search', { keyword, ...params })
  },

  // 获取推荐宠物
  getRecommendedPets(params = {}) {
    return http.get('/pets/recommended', params)
  },

  // 获取附近宠物
  getNearbyPets(lat, lng, radius = 10) {
    return http.get('/pets/nearby', { lat, lng, radius })
  },

  // 收藏/取消收藏宠物
  toggleFavorite(petId) {
    return http.post(`/pets/${petId}/favorite`)
  },

  // 获取收藏列表
  getFavorites(params = {}) {
    return http.get('/pets/favorites', params)
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