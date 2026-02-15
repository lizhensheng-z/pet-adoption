/**
 * 领养申请相关API接口
 * @module api/modules/application
 */

import http from '../request.js'

/**
 * 提交领养申请
 * @param {Object} data - 申请数据
 * @param {number} data.petId - 宠物ID
 * @param {string} data.reason - 申请理由
 * @param {string} data.contactInfo - 联系方式
 * @param {string} [data.remarks] - 备注信息
 * @param {Object} data.questionnaire - 问卷回答
 * @param {string} data.questionnaire.housing - 居住环境
 * @param {string} data.questionnaire.experience - 养宠经验
 * @param {string} data.questionnaire.familySize - 家庭成员数量
 * @param {string} data.questionnaire.dailyTime - 每日陪伴时间
 * @param {string} data.questionnaire.monthlyBudget - 每月预算
 * @param {string} data.questionnaire.vaccinationPlan - 疫苗接种计划
 * @param {string} data.questionnaire.emergencyPlan - 紧急情况处理
 * @returns {Promise} 返回Promise对象
 */
export function submitApplication(data) {
  return http.post('/adoption/applications', data)
}

/**
 * 获取我的申请列表
 * @param {Object} params - 查询参数
 * @param {string} [params.status] - 申请状态（SUBMITTED, UNDER_REVIEW, INTERVIEW, HOME_VISIT, APPROVED, REJECTED, CANCELLED）
 * @param {string} [params.sort] - 排序方式（desc/asc）
 * @param {number} [params.pageNo] - 页码，从1开始
 * @param {number} [params.pageSize] - 每页条数，默认10
 * @returns {Promise} 返回Promise对象，包含分页数据
 */
export function getApplications(params) {
  return http.get('/adoption/applications/me', params)
}

/**
 * 获取申请详情
 * @param {number|string} id - 申请ID
 * @returns {Promise} 返回Promise对象，包含申请详情
 */
export function getApplicationDetail(id) {
  return http.get(`/adoption/applications/${id}`)
}

/**
 * 取消申请
 * @param {number|string} id - 申请ID
 * @param {Object} data - 取消原因
 * @param {string} data.reason - 取消原因
 * @returns {Promise} 返回Promise对象
 */
export function cancelApplication(id, data) {
  return http.post(`/adoption/applications/${id}/cancel`, data)
}

/**
 * 申请状态枚举
 */
export const ApplicationStatus = {
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
export const ApplicationStatusMap = {
  [ApplicationStatus.SUBMITTED]: '已提交',
  [ApplicationStatus.UNDER_REVIEW]: '审核中',
  [ApplicationStatus.INTERVIEW]: '已约面谈',
  [ApplicationStatus.HOME_VISIT]: '家访中',
  [ApplicationStatus.APPROVED]: '已通过',
  [ApplicationStatus.REJECTED]: '已拒绝',
  [ApplicationStatus.CANCELLED]: '已取消'
}

/**
 * 申请状态颜色映射
 */
export const ApplicationStatusColor = {
  [ApplicationStatus.SUBMITTED]: 'info',
  [ApplicationStatus.UNDER_REVIEW]: 'warning',
  [ApplicationStatus.INTERVIEW]: 'warning',
  [ApplicationStatus.HOME_VISIT]: 'warning',
  [ApplicationStatus.APPROVED]: 'success',
  [ApplicationStatus.REJECTED]: 'danger',
  [ApplicationStatus.CANCELLED]: 'info'
}