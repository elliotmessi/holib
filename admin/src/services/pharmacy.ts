import http from "@/utils/http"

export type Pharmacy = {
  id: string
  name: string
  code: string
  hospitalId: string
  hospitalName: string
  address: string
  contact: string
  phone: string
  status: number
  createdAt: string
  updatedAt: string
}

export type PharmacyQueryParams = {
  name?: string
  code?: string
  hospitalId?: string
  status?: number
  page?: number
  pageSize?: number
}

export type PharmacyCreateRequest = {
  name: string
  code: string
  hospitalId: string
  address: string
  contact: string
  phone: string
  status?: number
}

export type PharmacyUpdateRequest = {
  name?: string
  code?: string
  hospitalId?: string
  address?: string
  contact?: string
  phone?: string
  status?: number
}

export const getPharmacyList = (params: PharmacyQueryParams) => http.get<{ list: Pharmacy[]; total: number }>("/hospital/pharmacies", params)

export const getPharmacyById = (id: string) => http.get<Pharmacy>(`/hospital/pharmacies/${id}`)

export const createPharmacy = (data: PharmacyCreateRequest) => http.post<Pharmacy>("/hospital/pharmacies", data)

export const updatePharmacy = (id: string, data: PharmacyUpdateRequest) => http.put<Pharmacy>(`/hospital/pharmacies/${id}`, data)

export const deletePharmacy = (id: string) => http.delete(`/hospital/pharmacies/${id}`)

export const batchDeletePharmacy = (ids: string[]) => http.delete("/hospital/pharmacies", { data: { ids } })
