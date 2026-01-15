import { createAlova } from "alova"
import fetch from "alova/fetch"

const alovaInstance = createAlova({
  baseURL: "/api/v1",
  requestAdapter: fetch(),
})

export type Inventory = {
  inventoryId: string
  drugId: string
  pharmacyId: string
  batchNumber: string
  quantity: number
  minimumThreshold: number
  maximumThreshold: number
  storageLocation: string
  validFrom: string
  validTo: string
  isFrozen: boolean
  createdAt: string
  updatedAt: string
  updatedBy: string
  drug: {
    drugCode: string
    genericName: string
    tradeName: string
    specification: string
    dosageForm: string
    manufacturer: string
  }
  pharmacy: {
    pharmacyCode: string
    name: string
    pharmacyType: string
  }
}

export type InventoryQueryParams = {
  page?: number
  pageSize?: number
  sort?: string
  order?: string
  filter?: string
  keyword?: string
}

export type InventoryCreateRequest = {
  drugId: string
  pharmacyId: string
  batchNumber: string
  quantity: number
  unitPrice: number
  storageLocation?: string
  validFrom: string
  validTo: string
  reason?: string
}

export type InventoryUpdateRequest = {
  minimumThreshold?: number
  maximumThreshold?: number
  storageLocation?: string
  isFrozen?: boolean
}

export type InventoryInboundRequest = {
  drugId: string
  pharmacyId: string
  batchNumber: string
  quantity: number
  unitPrice: number
  storageLocation?: string
  validFrom: string
  validTo: string
  reason?: string
}

export type InventoryOutboundRequest = {
  drugId: string
  pharmacyId: string
  batchNumber: string
  quantity: number
  unitPrice: number
  reason?: string
  referenceId?: string
}

export const inventory = {
  // 获取库存列表
  getList: (params: InventoryQueryParams) => {
    return alovaInstance.Get("/inventory", {
      params,
    })
  },

  // 获取库存详情
  getDetail: (id: string) => {
    return alovaInstance.Get(`/inventory/${id}`)
  },

  // 更新库存
  update: (id: string, data: InventoryUpdateRequest) => {
    return alovaInstance.Put(`/inventory/${id}`, data)
  },

  // 删除库存
  delete: (id: string) => {
    return alovaInstance.Delete(`/inventory/${id}`)
  },

  // 批量删除库存
  batchDelete: (ids: string[]) => {
    return alovaInstance.Delete("/inventory", {
      params: { ids: ids.join(",") },
    })
  },

  // 药品入库
  inbound: (data: InventoryInboundRequest) => {
    return alovaInstance.Post("/inventory/inbound", data)
  },

  // 药品出库
  outbound: (data: InventoryOutboundRequest) => {
    return alovaInstance.Post("/inventory/outbound", data)
  },

  // 查询出入库记录
  getTransactions: (params: InventoryQueryParams) => {
    return alovaInstance.Get("/inventory/transactions", {
      params,
    })
  },
}
