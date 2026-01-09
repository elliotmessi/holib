import http from "@/utils/http"

export type UserInfo = {
  id: string
  name: string
  nickName: string
  email: string
}

export type Menu = {
  id: string
  name: string
  path: string
  component: string
  meta: {
    title: string
    icon: string
  }
}

// 获取用户信息
export const getProfile = () => http.get<UserInfo>("/account/profile", undefined, { cacheFor: 0 })

// 获取权限列表
export const getPermissions = () => http.get<string[]>("/account/permissions")

// 获取菜单列表
export const getMenus = () => http.get<Menu[]>("/system/menus")

// 登出
export const logout = () => http.get<boolean>("/account/logout")
