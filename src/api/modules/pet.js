import http from '@/api/request.js'

/**
 * 宠物相关API接口
 */
export const petAPI = {
  /** 获取宠物列表（用户端） */
  getPets(params) {
    return http.get('/pets', params)
  },

  /** 获取宠物详情 */
  getPetDetail(id) {
    return http.get(`/pets/${id}`)
  },

  /** 获取机构自己的宠物列表 */
  getOrgPetList(params) {
    return http.get('/pets/org/my-pets', params)
  },

  /** 创建宠物 */
  createPet(data) {
    return http.post('/pets/org/createPet', data)
  },

  /** 更新宠物信息 */
  updatePet(id, data) {
    return http.put(`/pets/org/${id}`, data)
  },

  /** 删除宠物 */
  deletePet(id) {
    return http.delete(`/pets/org/${id}`)
  },

  /** 收藏/取消收藏 */
  toggleFavorite(petId) {
    return http.post('/favorites/toggle', { petId })
  },

  /** 检查收藏状态 */
  checkFavorite(petId) {
    return http.get(`/favorites/check/${petId}`)
  }
}

/**
 * 领养申请相关API接口
 */
export const applicationAPI = {
  submitApplication(data) {
    return http.post('/applications', data)
  },
  getApplicationDetail(id) {
    return http.get(`/applications/${id}`)
  },
  getMyApplications(params) {
    return http.get('/applications/my', params)
  }
}

// 默认导出（为了兼容性）
export default {
  petAPI,
  applicationAPI
}
