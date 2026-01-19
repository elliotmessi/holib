import http from "@/utils/http"
import { PaginatedResponse } from "@/types/pagination"

export type Hospital = {
  id: number
  name: string
  hospitalCode: string
  address: string
  contactPerson: string
  phone: string
  level?: string
  description?: string
  createdAt: string
  updatedAt: string
}

export type HospitalQueryParams = {
  name?: string
  hospitalCode?: string
  status?: number
  page?: number
  pageSize?: number
}

export type HospitalCreateRequest = {
  name: string
  code: string
  address: string
  contact: string
  phone: string
  email: string
  status?: number
}

export type HospitalUpdateRequest = {
  name?: string
  code?: string
  address?: string
  contact?: string
  phone?: string
  email?: string
  status?: number
}

export const getHospitalList = (params?: HospitalQueryParams) => http.get<PaginatedResponse<Hospital>>("/hospitals", params)

export const getHospitalById = (id: number) => http.get<Hospital>(`/hospitals/${id}`)

export const createHospital = (data: HospitalCreateRequest) => http.post<Hospital>("/hospitals", data)

export const updateHospital = (id: number, data: HospitalUpdateRequest) => http.put<Hospital>(`/hospitals/${id}`, data)

export const deleteHospital = (id: number) => http.delete(`/hospitals/${id}`)

export const batchDeleteHospital = (ids: number[]) => http.delete("/hospitals", { data: { ids } })
