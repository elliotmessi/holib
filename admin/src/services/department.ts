import http from "@/utils/http"

export type Department = {
  id: string
  name: string
  code: string
  hospitalId: string
  hospitalName: string
  type: number
  contact: string
  phone: string
  status: number
  createdAt: string
  updatedAt: string
}

export type DepartmentQueryParams = {
  name?: string
  code?: string
  hospitalId?: string
  type?: number
  status?: number
  page?: number
  pageSize?: number
}

export type DepartmentCreateRequest = {
  name: string
  code: string
  hospitalId: string
  type: number
  contact: string
  phone: string
  status?: number
}

export type DepartmentUpdateRequest = {
  name?: string
  code?: string
  hospitalId?: string
  type?: number
  contact?: string
  phone?: string
  status?: number
}

export const getDepartmentList = (params: DepartmentQueryParams) => http.get<{ list: Department[]; total: number }>("/hospital/departments", params)

export const getDepartmentById = (id: string) => http.get<Department>(`/hospital/departments/${id}`)

export const createDepartment = (data: DepartmentCreateRequest) => http.post<Department>("/hospital/departments", data)

export const updateDepartment = (id: string, data: DepartmentUpdateRequest) => http.put<Department>(`/hospital/departments/${id}`, data)

export const deleteDepartment = (id: string) => http.delete(`/hospital/departments/${id}`)

export const batchDeleteDepartment = (ids: string[]) => http.delete("/hospital/departments", { data: { ids } })
