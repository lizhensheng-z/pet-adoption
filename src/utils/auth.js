const ACCESS_TOKEN_KEY = 'pet_adoption_access_token'
const REFRESH_TOKEN_KEY = 'pet_adoption_refresh_token'

// Access Token 相关操作
export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function setAccessToken(token) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export function removeAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

// Refresh Token 相关操作
export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setRefreshToken(token) {
  localStorage.setItem(REFRESH_TOKEN_KEY, token)
}

export function removeRefreshToken() {
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

// 兼容旧版本 - 获取token（优先获取accessToken）
export function getToken() {
  return getAccessToken()
}

// 兼容旧版本 - 设置token
export function setToken(token) {
  setAccessToken(token)
}

// 移除所有token
export function removeToken() {
  removeAccessToken()
  removeRefreshToken()
}

// 保存完整的token信息
export function setTokens(accessToken, refreshToken) {
  setAccessToken(accessToken)
  if (refreshToken) {
    setRefreshToken(refreshToken)
  }
}

// 检查accessToken是否过期
export function isAccessTokenExpired() {
  const token = getAccessToken()
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

// 检查refreshToken是否存在
export function hasRefreshToken() {
  return !!getRefreshToken()
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

// 从accessToken获取用户ID
export function getUserIdFromToken() {
  const payload = getTokenPayload(getAccessToken())
  return payload?.sub || payload?.userId || null
}

// 从accessToken获取用户角色
export function getUserRoleFromToken() {
  const payload = getTokenPayload(getAccessToken())
  
  // 优先从 role 字段获取
  if (payload?.role) {
    return payload.role
  }
  
  // 如果没有 role 字段，从 authorities 数组中提取
  if (payload?.authorities && Array.isArray(payload.authorities)) {
    // 将 ['ROLE_ORG', 'ROLE_ADMIN'] 转换为 ['ORG', 'ADMIN']
    const authorities = payload.authorities.map(auth => {
      if (auth.startsWith('ROLE_')) {
        return auth.replace('ROLE_', '')
      }
      return auth
    })
    
    // 返回第一个非普通用户的角色
    // 优先级: ADMIN > ORG > USER
    if (authorities.includes('ADMIN')) return 'ADMIN'
    if (authorities.includes('ORG')) return 'ORG'
    if (authorities.includes('USER')) return 'USER'
  }
  
  return null
}
