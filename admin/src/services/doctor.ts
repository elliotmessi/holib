import http from "@/utils/http"

export type Doctor = {
  doctorId: string
  doctorCode: string
  name: string
  gender: string
  title: string
  practiceType: string
  practiceScope: string
  departmentId: string
  phone: string
  email: string
  avatar: string
  signature: string
  status: string
  createdAt: string
  updatedAt: string
}

export type DoctorQueryParams = {
  page?: number
  pageSize?: number
  sort?: string
  order?: string
  filter?: string
  keyword?: string
}

export type DoctorCreateRequest = {
  doctorCode: string
  name: string
  gender: string
  title: string
  practiceType: string
  practiceScope: string
  departmentId: string
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
  departmentId?: string
  phone?: string
  email?: string
  avatar?: string
  signature?: string
  status?: string
}

export const getDoctorList = (params: DoctorQueryParams) => http.get<{ list: Doctor[]; total: number }>("/doctors", params)

export const getDoctorById = (id: string) => http.get<Doctor>(`/doctors/${id}`)

export const createDoctor = (data: DoctorCreateRequest) => http.post<Doctor>("/doctors", data)

export const updateDoctor = (id: string, data: DoctorUpdateRequest) => http.put<Doctor>(`/doctors/${id}`, data)

export const deleteDoctor = (id: string) => http.delete(`/doctors/${id}`)

export const batchDeleteDoctor = (ids: string[]) => http.delete("/doctors", { data: { ids } })
