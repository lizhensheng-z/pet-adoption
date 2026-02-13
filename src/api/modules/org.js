import http from '../request.js'

// 机构相关API
export const orgAPI = {
  // 获取机构信息
  getOrgInfo() {
    return http.get('/org/info')
  },

  // 更新机构信息
  updateOrgInfo(data) {
    return http.put('/org/info', data)
  },

  // 获取机构宠物列表
  getOrgPets(params) {
    return http.get('/org/pets', params)
  },

  // 创建宠物档案
  createPet(data) {
    return http.post('/org/pets', data)
  },

  // 更新宠物信息
  updatePet(id, data) {
    return http.put(`/org/pets/${id}`, data)
  },

  // 删除宠物
  deletePet(id) {
    return http.delete(`/org/pets/${id}`)
  },

  // 上传宠物图片/视频
  uploadPetMedia(petId, formData) {
    return http.upload(`/org/pets/${petId}/media`, formData)
  },

  // 获取申请管理列表
  getApplications(params) {
    return http.get('/org/applications', params)
  },

  // 处理申请
  processApplication(id, action, data = {}) {
    return http.put(`/org/applications/${id}/${action}`, data)
  },

  // 获取领养记录
  getAdoptions(params) {
    return http.get('/org/adoptions', params)
  },

  // 获取回访管理列表
  getFollowups(params) {
    return http.get('/org/followups', params)
  },

  // 创建回访记录
  createFollowup(data) {
    return http.post('/org/followups', data)
  },

  // 获取统计数据
  getStatistics(params = {}) {
    return http.get('/org/statistics', params)
  }
}