import http from "@/utils/http"

export type Role = {
  id: number
  name: string
  code: string
  description: string
  status: number
  createdAt: string
  updatedAt: string
}

export type RoleQueryParams = {
  name?: string
  code?: string
  status?: number
  page?: number
  pageSize?: number
}

export type RoleCreateRequest = {
  name: string
  code: string
  description?: string
  status?: number
}

export type RoleUpdateRequest = {
  name?: string
  code?: string
  description?: string
  status?: number
}

export const getRoleList = (params: RoleQueryParams) => http.get<Role[]>("/system/roles", params)

export const getRoleById = (id: number) => http.get<Role>(`/system/roles/${id}`)

export const createRole = (data: RoleCreateRequest) => http.post<Role>("/system/roles", data)

export const updateRole = (id: number, data: RoleUpdateRequest) => http.put<Role>(`/system/roles/${id}`, data)

export const deleteRole = (id: number) => http.delete(`/system/roles/${id}`)

export const batchDeleteRole = (ids: number[]) => http.delete("/system/roles", { data: { ids } })

export const getRolePermissions = (id: number) => http.get<{ permissions: string[] }>(`/system/roles/${id}/permissions`)

export const updateRolePermissions = (id: number, data: { permissions: string[] }) => http.put(`/system/roles/${id}/permissions`, data)
