/**
 * 机构申请管理相关API接口
 * @module api/modules/org-adoption
 */

import http from '../request.js'

/**
 * 机构获取申请列表
 * @param {Object} params - 查询参数
 * @param {number} [params.petId] - 宠物ID筛选
 * @param {string} [params.status] - 申请状态筛选
 * @param {string} [params.keyword] - 搜索关键词（用户名或宠物名）
 * @param {number} [params.pageNo=1] - 页码
 * @param {number} [params.pageSize=10] - 每页条数
 * @param {string} [params.sortBy='create_time'] - 排序字段
 * @param {string} [params.order='desc'] - 排序方式
 * @returns {Promise} 返回Promise对象
 */
export function getOrgApplications(params) {
  return http.get('/org/adoption/applications', params)
}

/**
 * 机构获取申请详情
 * @param {number|string} applicationId - 申请ID
 * @returns {Promise} 返回Promise对象
 */
export function getOrgApplicationDetail(applicationId) {
  return http.get(`/org/adoption/applications/${applicationId}`)
}

/**
 * 机构更新申请状态
 * @param {number|string} applicationId - 申请ID
 * @param {Object} data - 状态更新数据
 * @param {string} data.status - 新状态（SUBMITTED/UNDER_REVIEW/INTERVIEW/HOME_VISIT/APPROVED/REJECTED/CANCELLED）
 * @param {string} [data.remark] - 机构备注或说明
 * @param {string} [data.rejectReason] - 拒绝原因（仅在拒绝时需要）
 * @returns {Promise} 返回Promise对象
 */
export function updateApplicationStatus(applicationId, data) {
  return http.post(`/org/adoption/applications/${applicationId}/status`, data)
}

/**
 * 申请状态枚举
 */
export const OrgApplicationStatus = {
  SUBMITTED: 'SUBMITTED', // 已提交
  UNDER_REVIEW: 'UNDER_REVIEW', // 审核中
  INTERVIEW: 'INTERVIEW', // 已约面谈
  HOME_VISIT: 'HOME_VISIT', // 家访中
  APPROVED: 'APPROVED', // 已通过
  REJECTED: 'REJECTED', // 已拒绝
  CANCELLED: 'CANCELLED' // 已取消
}

/**
 * 申请状态映射（中文显示）
 */
export const OrgApplicationStatusMap = {
  [OrgApplicationStatus.SUBMITTED]: '已提交',
  [OrgApplicationStatus.UNDER_REVIEW]: '审核中',
  [OrgApplicationStatus.INTERVIEW]: '已约面谈',
  [OrgApplicationStatus.HOME_VISIT]: '家访中',
  [OrgApplicationStatus.APPROVED]: '已通过',
  [OrgApplicationStatus.REJECTED]: '已拒绝',
  [OrgApplicationStatus.CANCELLED]: '已取消'
}

/**
 * 申请状态颜色映射
 */
export const OrgApplicationStatusColor = {
  [OrgApplicationStatus.SUBMITTED]: 'info',
  [OrgApplicationStatus.UNDER_REVIEW]: 'warning',
  [OrgApplicationStatus.INTERVIEW]: 'warning',
  [OrgApplicationStatus.HOME_VISIT]: 'warning',
  [OrgApplicationStatus.APPROVED]: 'success',
  [OrgApplicationStatus.REJECTED]: 'danger',
  [OrgApplicationStatus.CANCELLED]: 'info'
}

/**
 * 状态流转规则
 */
export const StatusTransitionRules = {
  [OrgApplicationStatus.SUBMITTED]: ['UNDER_REVIEW', 'REJECTED'],
  [OrgApplicationStatus.UNDER_REVIEW]: ['INTERVIEW', 'REJECTED'],
  [OrgApplicationStatus.INTERVIEW]: ['HOME_VISIT', 'REJECTED'],
  [OrgApplicationStatus.HOME_VISIT]: ['APPROVED', 'REJECTED'],
  [OrgApplicationStatus.APPROVED]: [],
  [OrgApplicationStatus.REJECTED]: [],
  [OrgApplicationStatus.CANCELLED]: []
}