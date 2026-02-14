import axios from 'axios'
import { ElMessage, ElLoading } from 'element-plus'
import { RESPONSE_CODES, ERROR_MESSAGES } from './types.js'
import { 
  getAccessToken, 
  removeToken, 
  getRefreshToken, 
  setAccessToken, 
  setRefreshToken 
} from '@/utils/auth.js'

// --- 全局变量定义 ---
let loadingInstance = null
let loadingCount = 0
let isRefreshing = false // 是否正在刷新 token
let requestsQueue = []   // 存储因 token 过期被挂起的请求队列

/**
 * 开启 Loading
 */
const startLoading = (config) => {
  if (config.showLoading === false) return
  if (loadingCount === 0) {
    loadingInstance = ElLoading.service({
      text: config.loadingText || '加载中...',
      background: 'rgba(255, 255, 255, 0.7)'
    })
  }
  loadingCount++
}

/**
 * 关闭 Loading
 */
const stopLoading = () => {
  if (loadingCount <= 0) return
  loadingCount--
  if (loadingCount === 0 && loadingInstance) {
    loadingInstance.close()
    loadingInstance = null
  }
}

// 创建 axios 实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
})

// --- 请求拦截器 ---
request.interceptors.request.use(
  (config) => {
    // 1. 注入 Token
    const token = getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    startLoading(config)
    return config
  },
  (error) => Promise.reject(error)
)

// --- 响应拦截器 ---
request.interceptors.response.use(
  (response) => {
    stopLoading()

    const { data } = response

    // 统一处理业务状态码
    if (data.code === RESPONSE_CODES.SUCCESS) {
      return data 
    } else {
      const errMsg = data.message || ERROR_MESSAGES[data.code] || '系统错误'
      
      // 登录态失效处理
      if (data.code === RESPONSE_CODES.AUTH_FAILED) {
        handleLogout()
      } else {
        ElMessage.error(errMsg)
      }
      return Promise.reject(new Error(errMsg))
    }
  },
  async (error) => {
    stopLoading()

    // 处理被取消的请求 (AbortController)
    if (axios.isCancel(error)) {
      return new Promise(() => {}) 
    }

    const { response } = error
    if (response) {
      const { status, config } = response

      // 401: Token 过期处理
      if (status === 401 && !config._isRetry) {
        return handleTokenRefresh(config)
      }

      const errMsg = handleHttpError(status, response.data)
      ElMessage.error(errMsg)
    } else {
      ElMessage.error('网络连接超时或服务器不可用')
    }

    return Promise.reject(error)
  }
)

/**
 * Token 刷新处理逻辑
 */
const handleTokenRefresh = (config) => {
  if (!isRefreshing) {
    isRefreshing = true
    const refreshToken = getRefreshToken()
    
    if (!refreshToken) {
      handleLogout()
      return Promise.reject(new Error('无刷新令牌'))
    }

    return axios.post('/api/auth/refresh-token', { refreshToken })
      .then(res => {
        const { accessToken, refreshToken: newRefreshToken } = res.data.data
        setAccessToken(accessToken)
        setRefreshToken(newRefreshToken)
        
        // 刷新成功，执行队列中的请求
        requestsQueue.forEach(cb => cb(accessToken))
        requestsQueue = []
        
        // 重试当前请求
        config._isRetry = true
        config.headers.Authorization = `Bearer ${accessToken}`
        return request(config)
      })
      .catch(() => {
        handleLogout()
        return Promise.reject(new Error('认证已失效'))
      })
      .finally(() => {
        isRefreshing = false
      })
  } else {
    return new Promise((resolve) => {
      requestsQueue.push((token) => {
        config.headers.Authorization = `Bearer ${token}`
        config._isRetry = true
        resolve(request(config))
      })
    })
  }
}

/**
 * 退出登录处理
 */
const handleLogout = () => {
  removeToken()
  if (!window.location.pathname.includes('/login')) {
    ElMessage.error('登录已过期，请重新登录')
    window.location.href = '/login'
  }
}

/**
 * 常用 HTTP 状态码错误文案
 */
const handleHttpError = (status, data) => {
  const map = {
    400: '请求参数错误',
    403: '拒绝访问：权限不足',
    404: '资源不存在',
    429: '请求过于频繁，请稍后再试',
    500: '服务器内部错误',
    502: '网关错误',
    503: '服务不可用'
  }
  return data?.message || map[status] || '未知网络错误'
}

// --- 请求方法封装 ---
const http = {
  get(url, params = {}, config = {}) {
    return request({ method: 'GET', url, params, ...config })
  },

  post(url, data = {}, config = {}) {
    return request({ method: 'POST', url, data, ...config })
  },

  put(url, data = {}, config = {}) {
    return request({ method: 'PUT', url, data, ...config })
  },

  delete(url, params = {}, config = {}) {
    return request({ method: 'DELETE', url, params, ...config })
  },

  upload(url, formData, config = {}) {
    return request({
      method: 'POST',
      url,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
      ...config
    })
  }
}

export default http
