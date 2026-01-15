import { createAlova } from "alova"
import fetch from "alova/fetch"

const alovaInstance = createAlova({
  baseURL: "/api/v1",
  requestAdapter: fetch(),
})

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

export const doctor = {
  // 获取医生列表
  getList: (params: DoctorQueryParams) => {
    return alovaInstance.Get("/doctors", {
      params,
    })
  },

  // 获取医生详情
  getDetail: (id: string) => {
    return alovaInstance.Get(`/doctors/${id}`)
  },

  // 创建医生
  create: (data: DoctorCreateRequest) => {
    return alovaInstance.Post("/doctors", data)
  },

  // 更新医生
  update: (id: string, data: DoctorUpdateRequest) => {
    return alovaInstance.Put(`/doctors/${id}`, data)
  },

  // 删除医生
  delete: (id: string) => {
    return alovaInstance.Delete(`/doctors/${id}`)
  },

  // 批量删除医生
  batchDelete: (ids: string[]) => {
    return alovaInstance.Delete("/doctors", {
      params: { ids: ids.join(",") },
    })
  },
}
