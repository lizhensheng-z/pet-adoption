// 管理端相关API
import http from '@/api/request.js'

// 公告管理相关API
export const noticeApi = {
  // 获取公告列表
  getNoticeList: (params) => http.get('/admin/notices', params),
  
  // 获取公告详情
  getNoticeDetail: (id) => http.get(`/admin/notices/${id}`),
  
  // 创建公告
  createNotice: (data) => http.post('/admin/notices', data),
  
  // 更新公告
  updateNotice: (id, data) => http.put(`/admin/notices/${id}`, data),
  
  // 删除公告
  deleteNotice: (id) => http.delete(`/admin/notices/${id}`),
  
  // 更新公告状态
  updateNoticeStatus: (id, status) => 
    http.patch(`/admin/notices/${id}/status`, { status })
}

// 用户端公告API
export const userNoticeApi = {
  // 获取已发布公告列表
  getNoticeList: (params) => http.get('/notices', params),
  
  // 获取公告详情
  getNoticeDetail: (id) => http.get(`/notices/${id}`)
}

// 标签管理相关API
export const tagApi = {
  // 获取标签列表
  getTagList: (params) => http.get('/admin/tags', params),
  
  // 创建标签
  createTag: (data) => http.post('/admin/tags', data),
  
  // 更新标签
  updateTag: (id, data) => http.put(`/admin/tags/${id}`, data),
  
  // 删除标签
  deleteTag: (id) => http.delete(`/admin/tags/${id}`),
  
  // 切换标签启用状态
  toggleTagStatus: (id, enabled) => 
    http.patch(`/admin/tags/${id}/toggle`, { enabled })
}

// 用户管理相关API
export const userApi = {
  // 获取用户列表
  getUserList: (params) => http.get('/admin/users', params),
  
  // 获取用户详情
  getUserDetail: (id) => http.get(`/admin/users/${id}`),
  
  // 更新用户
  updateUser: (id, data) => http.put(`/admin/users/${id}`, data),
  
  // 更新用户状态
  updateUserStatus: (id, status) => 
    http.patch(`/admin/users/${id}/status`, { status }),
  
  // 删除用户
  deleteUser: (id) => http.delete(`/admin/users/${id}`),
  
  // 批量更新用户状态
  batchUpdateUserStatus: (ids, status) => 
    http.patch('/admin/users/batch/status', { ids, status }),
  
  // 批量删除用户
  batchDeleteUsers: (ids) => 
    http.delete('/admin/users/batch', { ids }),
  
  // 导出用户
  exportUsers: (params) => http.get('/admin/users/export', params),
  
  // 重置用户密码
  resetUserPassword: (id) => 
    http.post(`/admin/users/${id}/reset-password`)
}

// 宠物管理相关API
export const petApi = {
  // 获取宠物列表
  getPetList: (params) => http.get('/admin/pets', params),

  // 获取宠物详情
  getPetDetail: (id) => http.get(`/admin/pets/${id}`),

  // 创建宠物
  createPet: (data) => http.post('/admin/pets', data),

  // 更新宠物
  updatePet: (id, data) => http.put(`/admin/pets/${id}`, data),

  // 删除宠物
  deletePet: (id) => http.delete(`/admin/pets/${id}`),

  // 更新宠物状态
  updatePetStatus: (id, status) =>
    http.patch(`/admin/pets/${id}/status`, { status })
}

// 宠物审核相关API
export const petAuditApi = {
  // 获取待审核宠物列表
  getPendingPets: (params) => http.get('/admin/pets/pending', params),

  // 获取待审核宠物详情
  getPetAuditDetail: (petId) => http.get(`/admin/pets/pending/${petId}`),

  // 审核宠物
  auditPet: (data) => http.post('/admin/pets/audit', data),

  // 获取待审核宠物数量
  countPendingPets: () => http.get('/admin/pets/pending/count')
}

// 机构管理相关API
export const orgApi = {
  // 获取机构列表
  getOrgList: (params) => http.get('/admin/orgs', params),
  
  // 获取机构详情
  getOrgDetail: (id) => http.get(`/admin/orgs/${id}`),
  
  // 审核机构
  auditOrg: (id, data) => http.post(`/admin/orgs/${id}/audit`, data),
  
  // 更新机构状态
  updateOrgStatus: (id, status) => 
    http.patch(`/admin/orgs/${id}/status`, { status })
}

// 数据统计相关API
export const statsApi = {
  // 获取系统统计信息
  getSystemStats: () => http.get('/admin/stats/system'),
  
  // 获取用户统计信息
  getUserStats: () => http.get('/admin/stats/users'),
  
  // 获取宠物统计信息
  getPetStats: () => http.get('/admin/stats/pets'),
  
  // 获取机构统计信息
  getOrgStats: () => http.get('/admin/stats/orgs'),
  
  // 获取Dashboard统计数据
  getDashboardStats: () => http.get('/admin/dashboard/stats'),
  
  // 获取Dashboard图表数据
  getDashboardCharts: (params) => http.get('/admin/dashboard/charts', params),
  
  // 获取待审核机构列表
  getPendingOrgs: (params) => http.get('/admin/organizations/pending', params),
  
  // 审核机构
  auditOrganization: (id, data) => http.put(`/admin/organizations/${id}/audit`, data),
  
  // 获取公告摘要
  getNoticesSummary: () => http.get('/admin/notices/summary')
}

// 系统配置相关API
export const configApi = {
  // 获取系统配置
  getSystemConfig: () => http.get('/admin/config'),
  
  // 更新系统配置
  updateSystemConfig: (data) => http.put('/admin/config', data),
  
  // 获取上传配置
  getUploadConfig: () => http.get('/admin/config/upload'),
  
  // 获取配置列表（分页）
  getConfigList: (params) => http.get('/admin/configs', params),
  
  // 保存配置（新增或修改）
  saveConfig: (data) => {
    return data.id 
      ? http.put(`/admin/configs/${data.id}`, data) 
      : http.post('/admin/configs', data)
  },
  
  // 删除配置
  deleteConfig: (id) => http.delete(`/admin/configs/${id}`)
}

// 文件上传相关API
export const uploadApi = {
  // 上传文件
  uploadFile: (formData) => http.upload('/admin/upload', formData),
  
  // 删除文件
  deleteFile: (fileUrl) => http.delete('/admin/upload', { fileUrl })
}

// 日志管理相关API
export const logApi = {
  // 获取操作日志列表
  getOperationLogs: (params) => http.get('/admin/logs/operation', params),
  
  // 获取登录日志列表
  getLoginLogs: (params) => http.get('/admin/logs/login', params),
  
  // 获取错误日志列表
  getErrorLogs: (params) => http.get('/admin/logs/error', params)
}

// 消息通知相关API
export const messageApi = {
  // 获取消息列表
  getMessageList: (params) => http.get('/admin/messages', params),
  
  // 发送系统消息
  sendSystemMessage: (data) => http.post('/admin/messages/system', data),
  
  // 批量发送消息
  sendBatchMessage: (data) => http.post('/admin/messages/batch', data)
}