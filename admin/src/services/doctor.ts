import http from "@/utils/http"
import { PaginatedResponse } from "@/types/pagination"

export type Doctor = {
  id: number
  doctorCode: string
  name: string
  gender: string
  title: string
  practiceType: string
  practiceScope: string
  departmentId: number
  phone: string
  email: string
  avatar: string
  signature: string
  status: string
  createdAt: string
  updatedAt: string
}

export type DoctorQueryParams = {
  name?: string
  departmentId?: number
  title?: string
  status?: string
  page?: number
  pageSize?: number
}

export type DoctorCreateRequest = {
  doctorCode: string
  name: string
  gender: string
  title: string
  practiceType: string
  practiceScope: string
  departmentId: number
  phone: string
  email?: string
  avatar?: string
  signature?: string
  status?: string
}

export type DoctorUpdateRequest = {
  name?: string
  gender?: string
  title?: string
  practiceType?: string
  practiceScope?: string
  departmentId?: number
  phone?: string
  email?: string
  avatar?: string
  signature?: string
  status?: string
}

export const getDoctorList = (params?: DoctorQueryParams) =>
  http.get<PaginatedResponse<Doctor>>("/doctors", params)

export const getDoctorById = (id: number) => http.get<Doctor>(`/doctors/${id}`)

export const createDoctor = (data: DoctorCreateRequest) => http.post<Doctor>("/doctors", data)

export const updateDoctor = (id: number, data: DoctorUpdateRequest) => http.put<Doctor>(`/doctors/${id}`, data)

export const deleteDoctor = (id: number) => http.delete(`/doctors/${id}`)

export const batchDeleteDoctor = (ids: number[]) => http.delete("/doctors", { data: { ids } })
