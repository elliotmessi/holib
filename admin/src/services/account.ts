import { request } from '@umijs/max'

// 获取用户信息
export async function getProfile(options?: { [key: string]: any }) {
  return request<{
    success: boolean
    data: {
      id: string
      name: string
      nickName: string
      email: string
    }
    errorMessage?: string
  }>('/account/profile', {
    method: 'GET',
    ...(options || {}),
  })
}

// 获取权限列表
export async function getPermissions(options?: { [key: string]: any }) {
  return request<{
    success: boolean
    data: string[]
    errorMessage?: string
  }>('/account/permissions', {
    method: 'GET',
    ...(options || {}),
  })
}

// 获取菜单列表
export async function getMenus(options?: { [key: string]: any }) {
  return request<{
    success: boolean
    data: any[]
    errorMessage?: string
  }>('/account/menus', {
    method: 'GET',
    ...(options || {}),
  })
}

// 登出
export async function logout(options?: { [key: string]: any }) {
  return request<{
    success: boolean
    data?: any
    errorMessage?: string
  }>('/account/logout', {
    method: 'GET',
    ...(options || {}),
  })
}
