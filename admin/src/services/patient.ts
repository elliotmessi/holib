import http from "@/utils/http"

export type Patient = {
  id: string
  name: string
  code: string
  gender: number
  birthDate: string
  idCard: string
  phone: string
  address: string
  emergencyContact: string
  emergencyPhone: string
  medicalHistory: string
  allergyHistory: string
  status: number
  createdAt: string
  updatedAt: string
}

export type PatientQueryParams = {
  name?: string
  code?: string
  idCard?: string
  phone?: string
  status?: number
  page?: number
  pageSize?: number
}

export type PatientCreateRequest = {
  name: string
  code: string
  gender: number
  birthDate: string
  idCard: string
  phone: string
  address?: string
  emergencyContact?: string
  emergencyPhone?: string
  medicalHistory?: string
  allergyHistory?: string
  status?: number
}

export type PatientUpdateRequest = {
  name?: string
  code?: string
  gender?: number
  birthDate?: string
  idCard?: string
  phone?: string
  address?: string
  emergencyContact?: string
  emergencyPhone?: string
  medicalHistory?: string
  allergyHistory?: string
  status?: number
}

export const getPatientList = (params: PatientQueryParams) => http.get<{ list: Patient[]; total: number }>("/hospital/patients", params)

export const getPatientById = (id: string) => http.get<Patient>(`/hospital/patients/${id}`)

export const createPatient = (data: PatientCreateRequest) => http.post<Patient>("/hospital/patients", data)

export const updatePatient = (id: string, data: PatientUpdateRequest) => http.put<Patient>(`/hospital/patients/${id}`, data)

export const deletePatient = (id: string) => http.delete(`/hospital/patients/${id}`)

export const batchDeletePatient = (ids: string[]) => http.delete("/hospital/patients", { data: { ids } })
