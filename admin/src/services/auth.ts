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
  confirmPassword?: string
  email?: string
}

export type TokenResponse = {
  accessToken: string
  refreshToken: string
}

export type CaptchaResponse = {
  id: string
  img: string
}

export const login = (data: LoginRequest) => http.post<TokenResponse>("/auth/login", data, { meta: { authRole: "login" } })

export const register = (data: RegisterRequest) => http.post("/auth/register", data)

export const refreshToken = (data: { refreshToken: string }) => http.post<TokenResponse>("/auth/refresh", data, { meta: { authRole: "refreshToken" } })

export const getCaptcha = (data: { width?: number; height?: number } = { width: 120, height: 40 }) =>
  http.get<CaptchaResponse>("/auth/captcha/img", data, { cacheFor: 0, meta: { isVisitor: true } })
