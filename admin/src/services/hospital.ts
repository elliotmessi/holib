import http from "@/utils/http"

export type Hospital = {
  id: string
  name: string
  code: string
  address: string
  contact: string
  phone: string
  email: string
  status: number
  createdAt: string
  updatedAt: string
}

export type HospitalQueryParams = {
  name?: string
  code?: string
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

export const getHospitalList = (params: HospitalQueryParams) => http.get<{ list: Hospital[]; total: number }>("/hospital/hospitals", params)

export const getHospitalById = (id: string) => http.get<Hospital>(`/hospital/hospitals/${id}`)

export const createHospital = (data: HospitalCreateRequest) => http.post<Hospital>("/hospital/hospitals", data)

export const updateHospital = (id: string, data: HospitalUpdateRequest) => http.put<Hospital>(`/hospital/hospitals/${id}`, data)

export const deleteHospital = (id: string) => http.delete(`/hospital/hospitals/${id}`)

export const batchDeleteHospital = (ids: string[]) => http.delete("/hospital/hospitals", { data: { ids } })
