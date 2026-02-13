import axios from 'axios'
import { ElMessage, ElLoading } from 'element-plus'
import { RESPONSE_CODES, ERROR_MESSAGES } from './types.js'
import { getToken, removeToken } from '@/utils/auth.js'

let loadingInstance = null
let pendingRequests = new Map()

// 创建axios实例
const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 生成请求唯一标识
const generateRequestKey = (config) => {
  const { method, url, params, data } = config
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&')
}

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 添加token
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 请求重复拦截
    const requestKey = generateRequestKey(config)
    if (pendingRequests.has(requestKey)) {
      return Promise.reject(new Error('请求重复'))
    }
    pendingRequests.set(requestKey, true)

    // 显示loading（可配置）
    if (config.showLoading !== false) {
      loadingInstance = ElLoading.service({
        text: '加载中...',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    }

    return config
  },
  (error) => {
    if (loadingInstance) {
      loadingInstance.close()
    }
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 清除请求记录
    const requestKey = generateRequestKey(response.config)
    pendingRequests.delete(requestKey)

    // 关闭loading
    if (loadingInstance) {
      loadingInstance.close()
    }

    const { data } = response

    // API规范响应格式
    if (data.code === RESPONSE_CODES.SUCCESS) {
      return data
    } else {
      // 业务错误处理
      const errorMessage = data.message || ERROR_MESSAGES[data.code] || '未知错误'
      
      // 特殊错误处理
      if (data.code === RESPONSE_CODES.AUTH_FAILED) {
        removeToken()
        window.location.href = '/login'
      }
      
      ElMessage.error(errorMessage)
      return Promise.reject(new Error(errorMessage))
    }
  },
  (error) => {
    // 清除请求记录
    if (error.config) {
      const requestKey = generateRequestKey(error.config)
      pendingRequests.delete(requestKey)
    }

    // 关闭loading
    if (loadingInstance) {
      loadingInstance.close()
    }

    // HTTP状态码错误处理
    let errorMessage = '网络错误，请检查网络连接'
    
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          errorMessage = '认证失败，请重新登录'
          removeToken()
          window.location.href = '/login'
          break
        case 403:
          errorMessage = '权限不足'
          break
        case 404:
          errorMessage = '请求的资源不存在'
          break
        case 429:
          errorMessage = '请求过于频繁，请稍后再试'
          break
        case 500:
          errorMessage = '服务器错误，请稍后再试'
          break
        default:
          errorMessage = data?.message || ERROR_MESSAGES[data?.code] || errorMessage
      }
    } else if (error.message === '请求重复') {
      errorMessage = '请勿重复提交'
    }

    ElMessage.error(errorMessage)
    return Promise.reject(error)
  }
)

// 请求方法封装
const http = {
  get(url, params = {}, config = {}) {
    return request({
      method: 'GET',
      url,
      params,
      ...config
    })
  },

  post(url, data = {}, config = {}) {
    return request({
      method: 'POST',
      url,
      data,
      ...config
    })
  },

  put(url, data = {}, config = {}) {
    return request({
      method: 'PUT',
      url,
      data,
      ...config
    })
  },

  delete(url, params = {}, config = {}) {
    return request({
      method: 'DELETE',
      url,
      params,
      ...config
    })
  },

  upload(url, formData, config = {}) {
    return request({
      method: 'POST',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      ...config
    })
  }
}

export default http