import http from "@/utils/http"

export type User = {
  id: string
  username: string
  name: string
  nickName: string
  email: string
  phone: string
  gender: number
  avatar: string
  roleId: string
  roleName: string
  departmentId: string
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
  roleId?: string
  departmentId?: string
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
  roleId: string
  departmentId: string
  status?: number
}

export type UserUpdateRequest = {
  name?: string
  nickName?: string
  email?: string
  phone?: string
  gender?: number
  avatar?: string
  roleId?: string
  departmentId?: string
  status?: number
}

export const getUserList = (params: UserQueryParams) => http.get<{ list: User[]; total: number }>("/system/users", params)

export const getUserById = (id: string) => http.get<User>(`/system/users/${id}`)

export const createUser = (data: UserCreateRequest) => http.post<User>("/system/users", data)

export const updateUser = (id: string, data: UserUpdateRequest) => http.put<User>(`/system/users/${id}`, data)

export const deleteUser = (id: string) => http.delete(`/system/users/${id}`)

export const batchDeleteUser = (ids: string[]) => http.delete("/system/users", { data: { ids } })

export const updateUserPassword = (id: string, data: { password: string }) => http.post(`/system/users/${id}/password`, data)
