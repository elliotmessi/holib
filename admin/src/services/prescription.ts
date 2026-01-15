import http from "@/utils/http"

export type Prescription = {
  id: string
  code: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  departmentId: string
  departmentName: string
  diagnosis: string
  totalAmount: number
  status: number
  reviewStatus: number
  reviewOpinion?: string
  createdAt: string
  updatedAt: string
}

export type PrescriptionQueryParams = {
  code?: string
  patientName?: string
  doctorName?: string
  status?: number
  reviewStatus?: number
  page?: number
  pageSize?: number
}

export const getPrescriptionList = (params: PrescriptionQueryParams) => http.get<{ list: Prescription[]; total: number }>("/hospital/prescriptions", params)

export const getPrescriptionById = (id: string) => http.get<Prescription>(`/hospital/prescriptions/${id}`)

export const reviewPrescription = (id: string, data: { reviewStatus: number; reviewOpinion?: string }) => http.put(`/hospital/prescriptions/${id}/review`, data)

export const cancelPrescription = (id: string) => http.post(`/hospital/prescriptions/${id}/cancel`)

export const getPendingReviewPrescriptions = (params: { pharmacyId?: string; page?: number; pageSize?: number }) => http.get<{ list: Prescription[]; total: number }>("/hospital/prescriptions/pending-review", params)
