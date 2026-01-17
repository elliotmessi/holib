import http from "@/utils/http"
import { PaginatedResponse } from "@/types/pagination"

export type PrescriptionDrug = {
  drugId: number
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
  id: number
  prescriptionNumber: string
  patientId: number
  doctorId: number
  departmentId: number
  pharmacyId: number
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
  pharmacy?: {
    name: string
  }
}

export type PrescriptionQueryParams = {
  patientId?: number
  doctorId?: number
  departmentId?: number
  pharmacyId?: number
  status?: string
  startDate?: string
  endDate?: string
  page?: number
  pageSize?: number
}

export type PrescriptionCreateRequest = {
  patientId: number
  departmentId: number
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

export const getPrescriptionList = (params?: PrescriptionQueryParams) =>
  http.get<PaginatedResponse<Prescription>>("/prescriptions", params)

export const getPrescriptionById = (id: number) => http.get<Prescription>(`/prescriptions/${id}`)

export const createPrescription = (data: PrescriptionCreateRequest) => http.post<Prescription>("/prescriptions", data)

export const updatePrescription = (id: number, data: PrescriptionUpdateRequest) => http.put<Prescription>(`/prescriptions/${id}`, data)

export const deletePrescription = (id: number) => http.delete(`/prescriptions/${id}`)

export const batchDeletePrescription = (ids: number[]) => http.delete("/prescriptions", { data: { ids } })

export const reviewPrescription = (id: number, data: PrescriptionReviewRequest) => http.put<Prescription>(`/prescriptions/${id}/review`, data)

export const cancelPrescription = (id: number) => http.post(`/prescriptions/${id}/cancel`)
