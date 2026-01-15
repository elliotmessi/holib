import http from "@/utils/http"

export type Inventory = {
  id: string
  drugId: string
  drugName: string
  drugCode: string
  specification: string
  unit: string
  pharmacyId: string
  pharmacyName: string
  batchNo: string
  expirationDate: string
  quantity: number
  minQuantity: number
  price: number
  status: number
  createdAt: string
  updatedAt: string
}

export type InventoryQueryParams = {
  drugName?: string
  drugCode?: string
  pharmacyId?: string
  batchNo?: string
  status?: number
  page?: number
  pageSize?: number
}

export type InventoryCreateRequest = {
  drugId: string
  pharmacyId: string
  batchNo: string
  expirationDate: string
  quantity: number
  minQuantity: number
  price: number
  status?: number
}

export type InventoryUpdateRequest = {
  minQuantity?: number
  price?: number
  status?: number
}

export type InventoryInboundRequest = {
  drugId: string
  pharmacyId: string
  batchNo: string
  expirationDate: string
  quantity: number
  price: number
  supplier?: string
  remark?: string
}

export type InventoryOutboundRequest = {
  drugId: string
  pharmacyId: string
  batchNo: string
  quantity: number
  prescriptionId?: string
  remark?: string
}

export const getInventoryList = (params: InventoryQueryParams) => http.get<{ list: Inventory[]; total: number }>("/hospital/inventory", params)

export const getInventoryById = (id: string) => http.get<Inventory>(`/hospital/inventory/${id}`)

export const updateInventory = (id: string, data: InventoryUpdateRequest) => http.put<Inventory>(`/hospital/inventory/${id}`, data)

export const inventoryInbound = (data: InventoryInboundRequest) => http.post("/hospital/inventory/inbound", data)

export const inventoryOutbound = (data: InventoryOutboundRequest) => http.post("/hospital/inventory/outbound", data)

export const getLowStockInventory = (params: { pharmacyId?: string; page?: number; pageSize?: number }) => http.get<{ list: Inventory[]; total: number }>("/hospital/inventory/low-stock", params)

export const getExpiringInventory = (params: { days?: number; page?: number; pageSize?: number }) => http.get<{ list: Inventory[]; total: number }>("/hospital/inventory/expiring", params)
