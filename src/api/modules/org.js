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
    return http.post('/pets/org/createPet', data)
  },

  // 更新宠物信息
  updatePet(id, data) {
    return http.put(`/pets/org/${id}`, data)
  },

  // 删除宠物
  deletePet(id) {
    return http.delete(`/pets/org/${id}`)
  },

// 保存宠物媒体关联（不包含文件上传）
  savePetMedia(petId, data) {
    return http.post(`/org/pets/${petId}/media`, data)
  },

  // 删除宠物媒体
  deletePetMedia(petId, mediaId) {
    return http.delete(`/org/pets/${petId}/media/${mediaId}`)
  },

  // 发布宠物
  publishPet(id) {
    return http.post(`/pets/org/pets/${id}/publish`)
  },

  // 获取标签列表
  getTagList(params = {}) {
    return http.get('/admin/tags', params)
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
  },

  // ========== Dashboard 首页相关 ==========

  // 获取首页统计数据
  getDashboardStatistics() {
    return http.get('/org/dashboard/statistics')
  },

  // 获取待办事项列表
  getDashboardTodos(params = {}) {
    return http.get('/org/dashboard/todos', params)
  },

  // 获取首页综合数据（推荐使用）
  getDashboardHome() {
    return http.get('/org/dashboard/home')
  },

  // 获取机构基本信息
  getOrgProfile() {
    return http.get('/org/profile')
  },

  // 创建机构资料
  createOrgProfile(data) {
    return http.post('/org/profile', data)
  },

  // 更新机构资料
  updateOrgProfile(data) {
    return http.post('/org/profile', data)
  },

  // 检查机构资料完整性
  checkProfileComplete() {
    return http.get('/org/profile/complete')
  },

  // 获取最近宠物列表
  getRecentPets(params = {}) {
    return http.get('/org/pets/recent', params)
  },

  // 获取最新申请列表
  getRecentApplications(params = {}) {
    return http.get('/org/applications/recent', params)
  },

  // 获取回访提醒列表
  getFollowupReminders(params = {}) {
    return http.get('/org/followup/reminders', params)
  }
}