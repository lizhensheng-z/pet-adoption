import http from '@/api/request.js'
import { getToken } from '@/utils/auth.js'

/**
 * AI聊天问答(流式响应)
 * @param {string} content - 用户提问内容
 * @returns {Promise<Response>} - 返回原生fetch响应(流式)
 */
export function chatCompletions(content) {
  const baseURL = import.meta.env.VITE_API_BASE_URL || ''
  const token = getToken()

  const headers = {
    'Accept': 'text/event-stream'
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return fetch(
    `${baseURL}/api/ai/deepseek/chatCompletions?content=${encodeURIComponent(content)}`,
    {
      method: 'GET',
      headers
    }
  )
}

/**
 * 按天分组获取会话列表
 * @param {number} days - 查询最近天数(默认7天,最大30天)
 * @returns {Promise} 会话列表
 */
export function getSessionListGroupByDay(days = 7) {
  return http.get('/ai/session/listGroupByDay', { days })
}

/**
 * 获取会话详情
 * @param {number} sessionId - 会话ID
 * @returns {Promise} 会话详情
 */
export function getSessionDetail(sessionId) {
  return http.post('/ai/session/detail', null, { params: { sessionId } })
}

/**
 * 删除会话
 * @param {number} sessionId - 会话ID
 * @returns {Promise} 删除结果
 */
export function deleteSession(sessionId) {
  return http.post('/ai/session/delete', null, { params: { sessionId } })
}

/**
 * 删除某天所有会话
 * @param {string} date - 日期(yyyy-MM-dd)
 * @returns {Promise} 删除结果
 */
export function deleteDaySessions(date) {
  return http.post('/ai/session/delete/day', null, { params: { date } })
}

/**
 * 获取账户余额
 * @returns {Promise} 余额信息
 */
export function getBalance() {
  return http.get('/ai/deepseek/account/balance')
}
