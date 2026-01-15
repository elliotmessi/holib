import { createAlova } from "alova"
import fetch from "alova/fetch"

const alovaInstance = createAlova({
  baseURL: "/api/v1",
  requestAdapter: fetch(),
})

export type Pharmacy = {
  pharmacyId: string
  pharmacyCode: string
  name: string
  hospitalId: string
  pharmacyType: string
  departmentId: string
  floor: string
  contactPerson: string
  phone: string
  description: string
  createdAt: string
  updatedAt: string
}

export type PharmacyQueryParams = {
  page?: number
  pageSize?: number
  sort?: string
  order?: string
  filter?: string
  keyword?: string
}

export type PharmacyCreateRequest = {
  pharmacyCode: string
  name: string
  hospitalId: string
  pharmacyType: string
  departmentId: string
  floor?: string
  contactPerson?: string
  phone?: string
  description?: string
}

export type PharmacyUpdateRequest = {
  name?: string
  pharmacyType?: string
  departmentId?: string
  floor?: string
  contactPerson?: string
  phone?: string
  description?: string
}

export const pharmacy = {
  // 获取药房列表
  getList: (params: PharmacyQueryParams) => {
    return alovaInstance.Get("/pharmacies", {
      params,
    })
  },

  // 获取药房详情
  getDetail: (id: string) => {
    return alovaInstance.Get(`/pharmacies/${id}`)
  },

  // 创建药房
  create: (data: PharmacyCreateRequest) => {
    return alovaInstance.Post("/pharmacies", data)
  },

  // 更新药房
  update: (id: string, data: PharmacyUpdateRequest) => {
    return alovaInstance.Put(`/pharmacies/${id}`, data)
  },

  // 删除药房
  delete: (id: string) => {
    return alovaInstance.Delete(`/pharmacies/${id}`)
  },

  // 批量删除药房
  batchDelete: (ids: string[]) => {
    return alovaInstance.Delete("/pharmacies", {
      params: { ids: ids.join(",") },
    })
  },
}
