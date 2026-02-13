const TOKEN_KEY = 'pet_adoption_token'
const REFRESH_TOKEN_KEY = 'pet_adoption_refresh_token'

// Token相关操作
export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setRefreshToken(token) {
  localStorage.setItem(REFRESH_TOKEN_KEY, token)
}

// 检查token是否过期
export function isTokenExpired(token) {
  if (!token) return true
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Date.now() / 1000
    return payload.exp < currentTime
  } catch (error) {
    console.error('解析token失败:', error)
    return true
  }
}

// 获取token载荷
export function getTokenPayload(token) {
  if (!token) return null
  
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (error) {
    console.error('解析token载荷失败:', error)
    return null
  }
}