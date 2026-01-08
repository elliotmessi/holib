import http from "@/utils/http"

export type LoginRequest = {
  username: string
  password: string
  captchaId: string
  verifyCode: string
}

export type RegisterRequest = {
  username: string
  password: string
  confirmPassword: string
  email?: string
}

export type LoginResponse = {
  token: string
}

export type RefreshTokenResponse = {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export type CaptchaResponse = {
  id: string
  img: string
}

export const login = (data: LoginRequest) => http.post<LoginResponse>("/auth/login", data)

export const register = (data: RegisterRequest) => http.post("/auth/register", data)

export const refreshToken = (data: { refreshToken: string }) => http.post<RefreshTokenResponse>("/auth/refresh", data)

export const getCaptcha = (data: { width?: number; height?: number } = { width: 120, height: 40 }) =>
  http.get<CaptchaResponse>("/auth/captcha/img", data, { cacheFor: 0 })
