import { UserInfo } from '@/services/account'
import { session, local } from '@/utils/storage'

const TOKEN_KEY = 'token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_INFO_KEY = 'user_info'

export interface TokenData {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export function getToken() {
  return session.get<string>(TOKEN_KEY)
}

export function setToken(token: string) {
  session.set(TOKEN_KEY, token)
}

export function getRefreshToken() {
  return session.get<string>(REFRESH_TOKEN_KEY) || ''
}

export function setRefreshToken(refreshToken: string) {
  session.set(REFRESH_TOKEN_KEY, refreshToken)
}

export function formatToken(token?: string) {
  return token ? `Bearer ${token}` : ''
}

export function getUserInfo() {
  const userInfo = local.get<UserInfo & { permissions: string[] }>(USER_INFO_KEY)
  return userInfo
}

export function setUserInfo(userInfo: Record<string, unknown>) {
  local.set(USER_INFO_KEY, userInfo)
}

export function clearAuth() {
  session.remove(TOKEN_KEY)
  session.remove(REFRESH_TOKEN_KEY)
  local.remove(USER_INFO_KEY)
}

export function isAuthenticated() {
  return !!getToken()
}
