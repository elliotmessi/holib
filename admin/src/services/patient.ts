import http from "@/utils/http"
import { PaginatedResponse } from "@/types/pagination"

export type Patient = {
  id: number
  medicalRecordNumber: string
  name: string
  gender: string
  age: number
  idCard: string
  phone: string
  height: number
  weight: number
  bloodType: string
  medicalHistory: string
  currentDiagnosis: string
  createdAt: string
  updatedAt: string
}

export type PatientQueryParams = {
  name?: string
  gender?: string
  medicalRecordNumber?: string
  idCard?: string
  phone?: string
  minAge?: number
  maxAge?: number
  page?: number
  pageSize?: number
}

export type PatientCreateRequest = {
  medicalRecordNumber: string
  name: string
  gender: string
  age: number
  idCard: string
  phone: string
  height?: number
  weight?: number
  bloodType?: string
  medicalHistory?: string
  currentDiagnosis?: string
}

export type PatientUpdateRequest = {
  name?: string
  gender?: string
  age?: number
  idCard?: string
  phone?: string
  height?: number
  weight?: number
  bloodType?: string
  medicalHistory?: string
  currentDiagnosis?: string
}

export const getPatientList = (params?: PatientQueryParams) =>
  http.get<PaginatedResponse<Patient>>("/patients", params)

export const getPatientById = (id: number) => http.get<Patient>(`/patients/${id}`)

export const createPatient = (data: PatientCreateRequest) => http.post<Patient>("/patients", data)

export const updatePatient = (id: number, data: PatientUpdateRequest) => http.put<Patient>(`/patients/${id}`, data)

export const deletePatient = (id: number) => http.delete(`/patients/${id}`)

export const batchDeletePatient = (ids: number[]) => http.delete("/patients", { data: { ids } })
