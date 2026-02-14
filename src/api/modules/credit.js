import http from '../request.js'

// 信用相关API
export const creditAPI = {
  // 获取我的信用信息
  getMyCredit() {
    return http.get('/credit/me')
  },

  // 获取信用详情（含历史记录）
  getCreditDetail() {
    return http.get('/credit/detail')
  },

  // 获取信用流水（支持分页和筛选）
  getCreditLogs(params = {}) {
    return http.get('/credit/logs', params)
  }
}
