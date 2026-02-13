import http from '../request.js'

// 用户认证相关API
export const authAPI = {
  // 登录
  login(data) {
    return http.post('/auth/login', data)
  },

  // 注册
  register(data) {
    return http.post('/auth/register', data)
  },

  // 退出登录
  logout() {
    return http.post('/auth/logout')
  },

  // 刷新token
  refreshToken() {
    return http.post('/auth/refresh')
  },

  // 获取用户信息
  getUserInfo() {
    return http.get('/auth/user')
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