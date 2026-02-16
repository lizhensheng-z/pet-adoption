/**
 * 公共文件上传接口
 * 基于 UploadController 的实现
 */
import http from '@/api/request.js'

/**
 * 文件上传
 * @param {FormData} formData - 表单数据，包含file和type字段
 * @param {object} config - 上传配置
 * @param {function} config.onUploadProgress - 上传进度回调
 * @returns {Promise} 上传结果
 *
 * @example
 * const formData = new FormData()
 * formData.append('file', file)
 * formData.append('type', 'pet_media')
 *
 * const response = await uploadAPI.uploadFile(formData, {
 *   onUploadProgress: (progressEvent) => {
 *     const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
 *     console.log(`上传进度: ${percentCompleted}%`)
 *   }
 * })
 *
 * console.log(response.data.url) // 文件URL
 */
export function uploadFile(formData, config = {}) {
  return http.upload('/upload', formData, config)
}

/**
 * 上传宠物照片
 * @param {File} file - 文件对象
 * @param {object} config - 上传配置
 * @returns {Promise} 上传结果
 */
export function uploadPetPhoto(file, config = {}) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', 'pet_media')
  return uploadFile(formData, config)
}

/**
 * 上传头像
 * @param {File} file - 文件对象
 * @param {object} config - 上传配置
 * @returns {Promise} 上传结果
 */
export function uploadAvatar(file, config = {}) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', 'avatar')
  return uploadFile(formData, config)
}

/**
 * 上传身份证照片
 * @param {File} file - 文件对象
 * @param {object} config - 上传配置
 * @returns {Promise} 上传结果
 */
export function uploadIdCard(file, config = {}) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', 'id_card')
  return uploadFile(formData, config)
}

/**
 * 上传营业执照
 * @param {File} file - 文件对象
 * @param {object} config - 上传配置
 * @returns {Promise} 上传结果
 */
export function uploadLicense(file, config = {}) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', 'license')
  return uploadFile(formData, config)
}

/**
 * 上传其他类型文件
 * @param {File} file - 文件对象
 * @param {object} config - 上传配置
 * @returns {Promise} 上传结果
 */
export function uploadOther(file, config = {}) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', 'other')
  return uploadFile(formData, config)
}

// 默认导出所有方法
export default {
  uploadFile,
  uploadPetPhoto,
  uploadAvatar,
  uploadIdCard,
  uploadLicense,
  uploadOther
}