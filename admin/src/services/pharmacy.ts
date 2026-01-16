import http from "@/utils/http"

export type Pharmacy = {
  pharmacyId: string
  pharmacyCode: string
  name: string
  hospitalId: string
  pharmacyType: string
  departmentId: string
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
  hospitalId: string
  pharmacyType: string
  departmentId: string
  floor?: string
  contactPerson?: string
  phone?: string
  description?: string
}

export type PharmacyUpdateRequest = {
  name?: string
  pharmacyType?: string
  departmentId?: string
  floor?: string
  contactPerson?: string
  phone?: string
  description?: string
}

export const getPharmacyList = (params: PharmacyQueryParams) => http.get<{ list: Pharmacy[]; total: number }>("/pharmacies", params)

export const getPharmacyById = (id: string) => http.get<Pharmacy>(`/pharmacies/${id}`)

export const createPharmacy = (data: PharmacyCreateRequest) => http.post<Pharmacy>("/pharmacies", data)

export const updatePharmacy = (id: string, data: PharmacyUpdateRequest) => http.put<Pharmacy>(`/pharmacies/${id}`, data)

export const deletePharmacy = (id: string) => http.delete(`/pharmacies/${id}`)

export const batchDeletePharmacy = (ids: string[]) => http.delete("/pharmacies", { data: { ids } })
