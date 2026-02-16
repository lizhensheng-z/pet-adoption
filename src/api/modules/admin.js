import http from '../request.js'

// 管理员相关API
export const adminAPI = {
  // 获取数据看板
  getDashboard(params = {}) {
    return http.get('/admin/dashboard', params)
  },

  // 获取宠物审核列表
  getPetAudits(params) {
    return http.get('/admin/pet-audits', params)
  },

  // 审核宠物
  auditPet(id, action, data = {}) {
    return http.put(`/admin/pet-audits/${id}/${action}`, data)
  },

  // 获取用户管理列表
  getUsers(params) {
    return http.get('/admin/users', params)
  },

  // 获取用户详情
  getUserDetail(id) {
    return http.get(`/admin/users/${id}`)
  },

  // 更新用户信息
  updateUser(id, data) {
    return http.put(`/admin/users/${id}`, data)
  },

  // 更新用户状态
  updateUserStatus(id, status) {
    return http.put(`/admin/users/${id}/status`, { status })
  },

  // 批量更新用户状态
  batchUpdateUserStatus(userIds, status) {
    return http.put('/admin/users/batch-status', { userIds, status })
  },

  // 批量删除用户
  batchDeleteUsers(userIds) {
    return http.delete('/admin/users/batch', { userIds })
  },

  // 导出用户数据
  exportUsers(params) {
    return http.get('/admin/users/export', params, {
      responseType: 'blob'
    })
  },

  // 获取标签管理列表
  getTags(params = {}) {
    return http.get('/admin/tags', params)
  },

  // 创建标签
  createTag(data) {
    return http.post('/admin/tags', data)
  },

  // 更新标签
  updateTag(id, data) {
    return http.put(`/admin/tags/${id}`, data)
  },

  // 删除标签
  deleteTag(id) {
    return http.delete(`/admin/tags/${id}`)
  },

  // 获取系统配置
  getConfig() {
    return http.get('/admin/config')
  },

  // 更新系统配置
  updateConfig(data) {
    return http.put('/admin/config', data)
  },

  // 获取公告管理列表
  getNotices(params) {
    return http.get('/admin/notices', params)
  },

  // 创建公告
  createNotice(data) {
    return http.post('/admin/notices', data)
  },

  // 更新公告
  updateNotice(id, data) {
    return http.put(`/admin/notices/${id}`, data)
  },

  // 删除公告
  deleteNotice(id) {
    return http.delete(`/admin/notices/${id}`)
  },

  // 获取审计日志
  getAuditLogs(params) {
    return http.get('/admin/audit-logs', params)
  }
  
}