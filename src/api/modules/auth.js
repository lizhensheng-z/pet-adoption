import http from '../request.js'

// 用户认证相关API
export const authAPI = {
  // 登录
  login(data) {
    return http.post('/auth/login', data, { showLoading: true })
  },

  // 注册
  register(data) {
    return http.post('/auth/register', data, { showLoading: true })
  },

  // 退出登录
  logout() {
    return http.post('/auth/logout', {}, { showLoading: false })
  },

  // 刷新token
  refreshToken(refreshToken) {
    return http.post('/auth/refresh-token', { refreshToken }, { showLoading: false })
  },

  // 获取当前用户信息
  getCurrentUser() {
    return http.get('/auth/me')
  },

  // 更新个人资料
  updateProfile(data) {
    return http.put('/auth/profile', data)
  }
}

// 用户相关API
export const userAPI = {
  // 获取用户列表
  getUsers(params) {
    return http.get('/users', params)
  },

  // 获取用户详情
  getUserDetail(id) {
    return http.get(`/users/${id}`)
  },

  // 更新用户信息
  updateUser(id, data) {
    return http.put(`/users/${id}`, data)
  },

  // 获取用户偏好设置
  getPreference() {
    return http.get('/users/preference')
  },

  // 更新偏好设置
  updatePreference(data) {
    return http.put('/users/preference', data)
  }
}
