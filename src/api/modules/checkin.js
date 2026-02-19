/**
 * 打卡相关API接口
 * 基于打卡规划文档的实现
 */
import http from '@/api/request.js'

/**
 * 创建打卡记录
 * @param {Object} data - 打卡数据
 * @param {number} data.petId - 宠物ID
 * @param {string} data.content - 打卡内容
 * @param {string[]} data.mediaUrls - 媒体文件URL数组
 * @returns {Promise} 创建结果
 */
export function createCheckin(data) {
  return http.post('/checkins', data)
}

/**
 * 获取我的打卡列表
 * @param {Object} params - 查询参数
 * @param {number} params.petId - 宠物ID（可选）
 * @param {number} params.pageNo - 页码，默认1
 * @param {number} params.pageSize - 每页条数，默认10
 * @returns {Promise} 打卡列表
 */
export function getMyCheckins(params = {}) {
  return http.get('/checkins/my', params)
}

/**
 * 获取打卡详情
 * @param {number} checkinId - 打卡ID
 * @returns {Promise} 打卡详情
 */
export function getCheckinDetail(checkinId) {
  return http.get(`/checkins/${checkinId}`)
}

/**
 * 删除打卡记录
 * @param {number} checkinId - 打卡ID
 * @returns {Promise} 删除结果
 */
export function deleteCheckin(checkinId) {
  return http.delete(`/checkins/${checkinId}`)
}

/**
 * 获取我已领养的宠物列表
 * @returns {Promise} 已领养宠物列表
 */
export function getMyAdoptedPets() {
  return http.get('/user/pets/adopted')
}

/**
 * 获取个人信用账户摘要
 * @returns {Promise} 信用摘要信息
 */
export function getCreditSummary() {
  return http.get('/user/credit/summary')
}

/**
 * 获取信用积分变更流水
 * @param {Object} params - 查询参数
 * @param {number} params.pageNo - 页码，默认1
 * @param {number} params.pageSize - 每页条数，默认10
 * @returns {Promise} 信用流水列表
 */
export function getCreditLogs(params = {}) {
  return http.get('/user/credit/logs', params)
}

/**
 * 获取打卡日历状态
 * @param {number} year - 年份
 * @param {number} month - 月份
 * @returns {Promise} 打卡日历数据
 */
export function getCheckinCalendar(year, month) {
  return http.get('/checkins/calendar', { year, month })
}

// 默认导出所有方法
export default {
  createCheckin,
  getMyCheckins,
  getCheckinDetail,
  deleteCheckin,
  getMyAdoptedPets,
  getCreditSummary,
  getCreditLogs,
  getCheckinCalendar
}