import { createAlova } from "alova"
import fetch from "alova/fetch"

const alovaInstance = createAlova({
  baseURL: "/api/v1",
  requestAdapter: fetch(),
})

export type Patient = {
  patientId: string
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
  page?: number
  pageSize?: number
  sort?: string
  order?: string
  filter?: string
  keyword?: string
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

export const patient = {
  // 获取患者列表
  getList: (params: PatientQueryParams) => {
    return alovaInstance.Get("/patients", {
      params,
    })
  },

  // 获取患者详情
  getDetail: (id: string) => {
    return alovaInstance.Get(`/patients/${id}`)
  },

  // 创建患者
  create: (data: PatientCreateRequest) => {
    return alovaInstance.Post("/patients", data)
  },

  // 更新患者
  update: (id: string, data: PatientUpdateRequest) => {
    return alovaInstance.Put(`/patients/${id}`, data)
  },

  // 删除患者
  delete: (id: string) => {
    return alovaInstance.Delete(`/patients/${id}`)
  },

  // 批量删除患者
  batchDelete: (ids: string[]) => {
    return alovaInstance.Delete("/patients", {
      params: { ids: ids.join(",") },
    })
  },
}
