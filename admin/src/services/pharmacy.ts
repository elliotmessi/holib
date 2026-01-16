import http from "@/utils/http"

export type Pharmacy = {
  id: number
  pharmacyCode: string
  name: string
  hospitalId: number
  pharmacyType: string
  departmentId: number
  floor: string
  contactPerson: string
  phone: string
  description: string
  createdAt: string
  updatedAt: string
}

export type PharmacyQueryParams = {
  page?: number
  pageSize?: number
  sort?: string
  order?: string
  filter?: string
  keyword?: string
}

export type PharmacyCreateRequest = {
  pharmacyCode: string
  name: string
  hospitalId: number
  pharmacyType: string
  departmentId: number
  floor?: string
  contactPerson?: string
  phone?: string
  description?: string
}

export type PharmacyUpdateRequest = {
  name?: string
  pharmacyType?: string
  departmentId?: number
  floor?: string
  contactPerson?: string
  phone?: string
  description?: string
}

export const getPharmacyList = (params: PharmacyQueryParams) => http.get<Pharmacy[]>("/pharmacies", params)

export const getPharmacyById = (id: number) => http.get<Pharmacy>(`/pharmacies/${id}`)

export const createPharmacy = (data: PharmacyCreateRequest) => http.post<Pharmacy>("/pharmacies", data)

export const updatePharmacy = (id: number, data: PharmacyUpdateRequest) => http.put<Pharmacy>(`/pharmacies/${id}`, data)

export const deletePharmacy = (id: number) => http.delete(`/pharmacies/${id}`)

export const batchDeletePharmacy = (ids: number[]) => http.delete("/pharmacies", { data: { ids } })
