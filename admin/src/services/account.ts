import http from "@/utils/http"

export type UserInfo = {
  id: string
  name: string
  nickName: string
  email: string
}

export type Menu = {
  id: number
  name: string
  path: string
  component: string
  activeMenu?: string
  createBy?: string
  createdAt?: string
  creator?: string
  extOpenMode?: number // 1 or 0?
  icon?: string
  isExt?: boolean
  keepAlive?: number // 1 or 0?
  orderNo?: number
  parentId?: number // 父id
  permission?: string
  pid?: number // 当前id
  show?: number // 1 | 0
  status?: number // 1 | 2 | 3
  type?: number // 0 | 1
  updateBy?: string
  updatedAt?: string
  updater?: string
  children?: Menu[]
}

// 获取用户信息
export const getProfile = () => http.get<UserInfo>("/account/profile", undefined, { cacheFor: 0 })

// 获取权限列表
export const getPermissions = () => http.get<string[]>("/account/permissions")

// 获取菜单列表
export const getMenus = () => http.get<Menu[]>("/system/menus")

// 登出
export const logout = () => http.get<boolean>("/account/logout")
