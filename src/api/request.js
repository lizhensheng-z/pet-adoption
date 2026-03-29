import axios from 'axios'
import { ElMessage, ElLoading } from 'element-plus'
import { RESPONSE_CODES, ERROR_MESSAGES } from './types.js'
import {
  getAccessToken,
  removeToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  isAccessTokenExpired
} from '@/utils/auth.js'

// --- 全局变量定义 ---
let loadingInstance = null
let loadingCount = 0
let isRefreshing = false // 是否正在刷新 token
let requestsQueue = []   // 存储因 token 过期被挂起的请求队列
let logoutTimer = null   // 防止重复跳转登录页

// 获取 API 基础路径
const getBaseURL = () => import.meta.env.VITE_API_BASE_URL || '/api'

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
  baseURL: getBaseURL(),
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
        handleLogout('登录已过期，请重新登录')
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
      return Promise.reject(new Error('请求已取消'))
    }

    const { response } = error
    if (response) {
      const { status, config } = response

      // 401: Token 过期处理
      if (status === 401 && !config._isRetry) {
        return handleTokenRefresh(config)
      }

      // 403: 权限不足
      if (status === 403) {
        ElMessage.error('权限不足，无法访问')
        return Promise.reject(error)
      }

      const errMsg = handleHttpError(status, response.data)
      ElMessage.error(errMsg)
    } else {
      // 网络错误或请求被拦截
      if (error.code === 'ECONNABORTED') {
        ElMessage.error('请求超时，请稍后重试')
      } else if (!axios.isCancel(error)) {
        ElMessage.error('网络连接异常，请检查网络')
      }
    }

    return Promise.reject(error)
  }
)

/**
 * Token 刷新处理逻辑
 */
const handleTokenRefresh = async (config) => {
  // 如果已经在刷新中，将请求加入队列
  if (isRefreshing) {
    return new Promise((resolve) => {
      requestsQueue.push((token) => {
        config.headers.Authorization = `Bearer ${token}`
        config._isRetry = true
        resolve(request(config))
      })
    })
  }

  isRefreshing = true
  const refreshToken = getRefreshToken()

  // 没有 refreshToken，直接登出
  if (!refreshToken) {
    handleLogout('登录已过期，请重新登录')
    return Promise.reject(new Error('无刷新令牌'))
  }

  try {
    // 使用完整的 baseURL 进行刷新请求
    const baseURL = getBaseURL()
    const response = await axios.post(`${baseURL}/auth/refresh-token`, { refreshToken })

    const { accessToken, refreshToken: newRefreshToken } = response.data.data

    // 保存新 token
    setAccessToken(accessToken)
    setRefreshToken(newRefreshToken)

    // 刷新成功，执行队列中的请求
    requestsQueue.forEach(cb => cb(accessToken))
    requestsQueue = []

    // 重试当前请求
    config._isRetry = true
    config.headers.Authorization = `Bearer ${accessToken}`
    return request(config)
  } catch (error) {
    // 刷新失败，清除队列并登出
    requestsQueue = []
    handleLogout('登录已过期，请重新登录')
    return Promise.reject(new Error('认证已失效'))
  } finally {
    isRefreshing = false
  }
}

/**
 * 退出登录处理
 * @param {string} message - 提示消息
 */
const handleLogout = (message = '登录已过期，请重新登录') => {
  // 防止重复调用
  if (logoutTimer) return

  // 清除 token
  removeToken()

  // 清除队列
  requestsQueue = []
  isRefreshing = false

  // 如果不在登录页，跳转到登录页
  if (!window.location.pathname.includes('/login')) {
    ElMessage.error(message)

    // 延迟跳转，确保消息能显示
    logoutTimer = setTimeout(() => {
      logoutTimer = null
      // 使用 replace 避免回退
      window.location.replace('/login')
    }, 500)
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

// 导出 handleLogout 供外部使用
export { handleLogout }

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

  patch(url, data = {}, config = {}) {
    return request({ method: 'PATCH', url, data, ...config })
  },

  upload(url, formData, config = {}) {
    return request({
      method: 'POST',
      url,
       formData,
      headers: { 'Content-Type': 'multipart/form-data' },
      ...config
    })
  }
}

export default http