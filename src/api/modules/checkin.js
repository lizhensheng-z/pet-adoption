import http from '../request.js'

// 打卡相关API
export const checkinAPI = {
  // 获取我的打卡列表
  getMyCheckins(params = {}) {
    return http.get('/checkins/my', params)
  },

  // 创建打卡
  createCheckin(data) {
    return http.post('/checkins', data, { showLoading: true })
  },

  // 获取打卡详情
  getCheckinDetail(id) {
    return http.get(`/checkins/${id}`)
  },

  // 点赞打卡
  likeCheckin(id) {
    return http.post(`/checkins/${id}/like`)
  },

  // 取消点赞
  unlikeCheckin(id) {
    return http.delete(`/checkins/${id}/like`)
  }
}
