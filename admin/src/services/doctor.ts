import http from "@/utils/http"

export type Doctor = {
  id: string
  name: string
  code: string
  gender: number
  phone: string
  email: string
  departmentId: string
  departmentName: string
  title: string
  specialty: string
  status: number
  createdAt: string
  updatedAt: string
}

export type DoctorQueryParams = {
  name?: string
  code?: string
  departmentId?: string
  title?: string
  status?: number
  page?: number
  pageSize?: number
}

export type DoctorCreateRequest = {
  name: string
  code: string
  gender: number
  phone: string
  email?: string
  departmentId: string
  title: string
  specialty: string
  status?: number
}

export type DoctorUpdateRequest = {
  name?: string
  code?: string
  gender?: number
  phone?: string
  email?: string
  departmentId?: string
  title?: string
  specialty?: string
  status?: number
}

export const getDoctorList = (params: DoctorQueryParams) => http.get<{ list: Doctor[]; total: number }>("/hospital/doctors", params)

export const getDoctorById = (id: string) => http.get<Doctor>(`/hospital/doctors/${id}`)

export const createDoctor = (data: DoctorCreateRequest) => http.post<Doctor>("/hospital/doctors", data)

export const updateDoctor = (id: string, data: DoctorUpdateRequest) => http.put<Doctor>(`/hospital/doctors/${id}`, data)

export const deleteDoctor = (id: string) => http.delete(`/hospital/doctors/${id}`)

export const batchDeleteDoctor = (ids: string[]) => http.delete("/hospital/doctors", { data: { ids } })
