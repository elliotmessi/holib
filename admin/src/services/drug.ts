import http from "@/utils/http"

export type Drug = {
  id: string
  name: string
  code: string
  category: string
  specification: string
  unit: string
  manufacturer: string
  dosageForm: string
  price: number
  status: number
  createdAt: string
  updatedAt: string
}

export type DrugQueryParams = {
  name?: string
  code?: string
  category?: string
  manufacturer?: string
  status?: number
  page?: number
  pageSize?: number
}

export type DrugCreateRequest = {
  name: string
  code: string
  category: string
  specification: string
  unit: string
  manufacturer: string
  dosageForm: string
  price: number
  status?: number
}

export type DrugUpdateRequest = {
  name?: string
  code?: string
  category?: string
  specification?: string
  unit?: string
  manufacturer?: string
  dosageForm?: string
  price?: number
  status?: number
}

export const getDrugList = (params: DrugQueryParams) => http.get<{ list: Drug[]; total: number }>("/hospital/drugs", params)

export const getDrugById = (id: string) => http.get<Drug>(`/hospital/drugs/${id}`)

export const createDrug = (data: DrugCreateRequest) => http.post<Drug>("/hospital/drugs", data)

export const updateDrug = (id: string, data: DrugUpdateRequest) => http.put<Drug>(`/hospital/drugs/${id}`, data)

export const deleteDrug = (id: string) => http.delete(`/hospital/drugs/${id}`)

export const batchDeleteDrug = (ids: string[]) => http.delete("/hospital/drugs", { data: { ids } })
