import { createAlova } from "alova"
import fetch from "alova/fetch"

const alovaInstance = createAlova({
  baseURL: "/api/v1",
  requestAdapter: fetch(),
})

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

export const prescription = {
  // 获取处方列表
  getList: (params: PrescriptionQueryParams) => {
    return alovaInstance.Get("/prescriptions", {
      params,
    })
  },

  // 获取处方详情
  getDetail: (id: string) => {
    return alovaInstance.Get(`/prescriptions/${id}`)
  },

  // 创建处方
  create: (data: PrescriptionCreateRequest) => {
    return alovaInstance.Post("/prescriptions", data)
  },

  // 更新处方
  update: (id: string, data: PrescriptionUpdateRequest) => {
    return alovaInstance.Put(`/prescriptions/${id}`, data)
  },

  // 删除处方
  delete: (id: string) => {
    return alovaInstance.Delete(`/prescriptions/${id}`)
  },

  // 批量删除处方
  batchDelete: (ids: string[]) => {
    return alovaInstance.Delete("/prescriptions", {
      params: { ids: ids.join(",") },
    })
  },

  // 审核处方
  review: (id: string, data: { status: string; reviewOpinion?: string }) => {
    return alovaInstance.Put(`/prescriptions/${id}/review`, data)
  },

  // 取消处方
  cancel: (id: string) => {
    return alovaInstance.Post(`/prescriptions/${id}/cancel`)
  },
}
