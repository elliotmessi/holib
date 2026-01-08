import http from "@/utils/http"

export type UserInfo = {
  id: string
  name: string
  nickName: string
  email: string
}

// 获取用户信息
export const getProfile = () => http.get<UserInfo>("/account/profile", undefined, { cacheFor: 0 })

// 获取权限列表
export const getPermissions = () => http.get<string[]>("/account/permissions")

// 获取菜单列表
export const getMenus = () => http.get<unknown[]>("/account/menus")

// 登出
export const logout = () => http.get<boolean>("/account/logout")
