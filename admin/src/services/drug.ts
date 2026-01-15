import { createAlova } from "alova"
import fetch from "alova/fetch"

const alovaInstance = createAlova({
  baseURL: "/api/v1",
  requestAdapter: fetch(),
})

export const drugs = {
  // 获取药品列表
  getList: (params: any) => {
    return alovaInstance.Get("/drugs", {
      params,
    })
  },

  // 获取药品详情
  getDetail: (id: string) => {
    return alovaInstance.Get(`/drugs/${id}`)
  },

  // 创建药品
  create: (data: any) => {
    return alovaInstance.Post("/drugs", data)
  },

  // 更新药品
  update: (id: string, data: any) => {
    return alovaInstance.Put(`/drugs/${id}`, data)
  },

  // 删除药品
  delete: (id: string) => {
    return alovaInstance.Delete(`/drugs/${id}`)
  },

  // 批量删除药品
  batchDelete: (ids: string[]) => {
    return alovaInstance.Delete("/drugs", {
      params: { ids: ids.join(",") },
    })
  },

  // 导入药品
  import: (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    return alovaInstance.Post("/drugs/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  },

  // 导出药品
  export: (params: any) => {
    return alovaInstance.Get("/drugs/export", {
      params,
    })
  },
}
