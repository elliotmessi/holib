import { request } from '@umijs/max'

interface LoginResponse {
  token: string
}

interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

interface CaptchaResponse {
  id: string
  img: string
}

interface ApiResponse<T> {
  code: number
  data: T
  message: string
}

export async function login(
  body: {
    username: string
    password: string
    captchaId: string
    verifyCode: string
  },
  options?: Record<string, unknown>,
) {
  return request<ApiResponse<LoginResponse>>('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

export async function register(
  body: {
    username: string
    password: string
    confirmPassword: string
    email?: string
  },
  options?: Record<string, unknown>,
) {
  return request<ApiResponse<void>>('/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

export async function refreshToken(
  body: { refreshToken: string },
  options?: Record<string, unknown>,
) {
  return request<ApiResponse<RefreshTokenResponse>>('/auth/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

export async function getCaptcha(options?: Record<string, unknown>) {
  return request<ApiResponse<CaptchaResponse>>('/auth/captcha/img', {
    method: 'GET',
    ...(options || {}),
  })
}
