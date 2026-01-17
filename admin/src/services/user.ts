import { PaginatedResponse } from "@/types/pagination"
import http from "@/utils/http"

export type User = {
  id: number
  username: string
  name: string
  nickName: string
  email: string
  phone: string
  gender: number
  avatar: string
  roleId: number
  roleName: string
  departmentId: number
  departmentName: string
  status: number
  createdAt: string
  updatedAt: string
}

export type UserQueryParams = {
  username?: string
  name?: string
  email?: string
  phone?: string
  roleId?: number
  departmentId?: number
  status?: number
  page?: number
  pageSize?: number
}

export type UserCreateRequest = {
  username: string
  password: string
  name: string
  nickName?: string
  email?: string
  phone?: string
  gender?: number
  avatar?: string
  roleId: number
  departmentId: number
  status?: number
}

export type UserUpdateRequest = {
  name?: string
  nickName?: string
  email?: string
  phone?: string
  gender?: number
  avatar?: string
  roleId?: number
  departmentId?: number
  status?: number
}

export const getUserList = (params?: UserQueryParams) => http.get<PaginatedResponse<User>>("/system/users", params)

export const getUserById = (id: number) => http.get<User>(`/system/users/${id}`)

export const createUser = (data: UserCreateRequest) => http.post<User>("/system/users", data)

export const updateUser = (id: number, data: UserUpdateRequest) => http.put<User>(`/system/users/${id}`, data)

export const deleteUser = (id: number) => http.delete(`/system/users/${id}`)

export const batchDeleteUser = (ids: number[]) => http.delete("/system/users", { data: { ids } })

export const updateUserPassword = (id: number, data: { password: string }) => http.post(`/system/users/${id}/password`, data)
