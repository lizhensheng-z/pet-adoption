/**
 * 用户相关API接口
 * @module api/modules/user
 */

import http from '../request.js'

/**
 * 获取当前用户信息
 * @returns {Promise} 返回Promise对象
 */
export function getUserProfile() {
  return http.get('/user/profile')
}

/**
 * 更新用户个人资料
 * @param {Object} data - 更新数据
 * @param {string} [data.avatar] - 头像URL
 * @param {string} [data.phone] - 手机号
 * @param {string} [data.email] - 邮箱
 * @returns {Promise} 返回Promise对象
 */
export function updateUserProfile(data) {
  return http.put('/user/profile', data)
}

/**
 * 修改密码
 * @param {Object} data - 修改密码数据
 * @param {string} data.oldPassword - 原密码
 * @param {string} data.newPassword - 新密码
 * @returns {Promise} 返回Promise对象
 */
export function changePassword(data) {
  return http.put('/user/password', data)
}