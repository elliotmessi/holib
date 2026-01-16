import http from "@/utils/http"

export type PrescriptionDrug = {
  drugId: string
  dosage: number
  dosageUnit: string
  frequency: string
  administrationRoute: string
  duration: number
  quantity: number
  unitPrice: number
  totalPrice?: number
}

export type Prescription = {
  prescriptionId: string
  prescriptionNumber: string
  patientId: string
  doctorId: string
  departmentId: string
  diagnosis: string
  totalAmount: number
  status: string
  createdAt: string
  updatedAt: string
  prescriptionDrugs?: PrescriptionDrug[]
  patient?: {
    name: string
    gender: string
    age: number
    medicalRecordNumber: string
  }
  doctor?: {
    name: string
    doctorCode: string
    title: string
  }
  department?: {
    name: string
  }
}

export type PrescriptionQueryParams = {
  page?: number
  pageSize?: number
  sort?: string
  order?: string
  filter?: string
  keyword?: string
}

export type PrescriptionCreateRequest = {
  patientId: string
  departmentId: string
  diagnosis: string
  prescriptionDrugs: PrescriptionDrug[]
}

export type PrescriptionUpdateRequest = {
  diagnosis?: string
  prescriptionDrugs?: PrescriptionDrug[]
  status?: string
}

export type PrescriptionReviewRequest = {
  status: string
  reviewOpinion?: string
}

export const getPrescriptionList = (params: PrescriptionQueryParams) => http.get<{ list: Prescription[]; total: number }>("/prescriptions", params)

export const getPrescriptionById = (id: string) => http.get<Prescription>(`/prescriptions/${id}`)

export const createPrescription = (data: PrescriptionCreateRequest) => http.post<Prescription>("/prescriptions", data)

export const updatePrescription = (id: string, data: PrescriptionUpdateRequest) => http.put<Prescription>(`/prescriptions/${id}`, data)

export const deletePrescription = (id: string) => http.delete(`/prescriptions/${id}`)

export const batchDeletePrescription = (ids: string[]) => http.delete("/prescriptions", { data: { ids } })

export const reviewPrescription = (id: string, data: PrescriptionReviewRequest) => http.put<Prescription>(`/prescriptions/${id}/review`, data)

export const cancelPrescription = (id: string) => http.post(`/prescriptions/${id}/cancel`)
