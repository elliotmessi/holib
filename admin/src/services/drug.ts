import http from "@/utils/http"

export type Drug = {
  id: string
  genericName: string
  tradeName: string
  specification: string
  dosageForm: string
  manufacturer: string
  approvalNumber: string
  drugType: string
  usePurpose: string
  usageMethod: string
  validFrom: string
  validTo: string
  retailPrice: number
  wholesalePrice: number
  medicalInsuranceRate: number
  status: string
  createdAt: string
  updatedAt: string
}

export type DrugQueryParams = {
  page?: number
  pageSize?: number
  sort?: string
  order?: string
  filter?: string
  keyword?: string
}

export type DrugCreateRequest = {
  genericName: string
  tradeName?: string
  specification: string
  dosageForm: string
  manufacturer: string
  approvalNumber: string
  drugType: string
  usePurpose?: string
  usageMethod?: string
  validFrom: string
  validTo: string
  retailPrice: number
  wholesalePrice: number
  medicalInsuranceRate?: number
  status?: string
}

export type DrugUpdateRequest = {
  genericName?: string
  tradeName?: string
  specification?: string
  dosageForm?: string
  manufacturer?: string
  approvalNumber?: string
  drugType?: string
  usePurpose?: string
  usageMethod?: string
  validFrom?: string
  validTo?: string
  retailPrice?: number
  wholesalePrice?: number
  medicalInsuranceRate?: number
  status?: string
}

export const getDrugList = (params: DrugQueryParams) => http.get<{ list: Drug[]; total: number }>("/drugs", params)

export const getDrugById = (id: string) => http.get<Drug>(`/drugs/${id}`)

export const createDrug = (data: DrugCreateRequest) => http.post<Drug>("/drugs", data)

export const updateDrug = (id: string, data: DrugUpdateRequest) => http.put<Drug>(`/drugs/${id}`, data)

export const deleteDrug = (id: string) => http.delete(`/drugs/${id}`)

export const batchDeleteDrug = (ids: string[]) => http.delete("/drugs", { data: { ids } })

export const importDrug = (file: File) => {
  const formData = new FormData()
  formData.append("file", file)
  return http.post("/drugs/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}

export const exportDrug = (params: DrugQueryParams) => http.get("/drugs/export", params)
