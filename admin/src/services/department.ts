import http from "@/utils/http"
import { PaginatedResponse } from "@/types/pagination"

export type Department = {
  id: number
  name: string
  code: string
  hospitalId: number
  type: string
  contact: string
  phone: string
  status: number
  createdAt: string
  updatedAt: string
}

export type DepartmentQueryParams = {
  name?: string
  hospitalId?: number
  type?: string
  status?: number
  page?: number
  pageSize?: number
}

export type DepartmentCreateRequest = {
  name: string
  code: string
  hospitalId: number
  type: string
  contact: string
  phone: string
  status?: number
}

export type DepartmentUpdateRequest = {
  name?: string
  code?: string
  hospitalId?: number
  type?: string
  contact?: string
  phone?: string
  status?: number
}

export const getDepartmentList = (params?: DepartmentQueryParams) =>
  http.get<PaginatedResponse<Department>>("/departments", params)

export const getDepartmentById = (id: number) => http.get<Department>(`/departments/${id}`)

export const createDepartment = (data: DepartmentCreateRequest) => http.post<Department>("/departments", data)

export const updateDepartment = (id: number, data: DepartmentUpdateRequest) => http.put<Department>(`/departments/${id}`, data)

export const deleteDepartment = (id: number) => http.delete(`/departments/${id}`)

export const batchDeleteDepartment = (ids: number[]) => http.delete("/departments", { data: { ids } })
