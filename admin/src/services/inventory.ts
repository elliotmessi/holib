import http from "@/utils/http"
import { PaginatedResponse } from "@/types/pagination"

export type Inventory = {
  id: number
  drugId: number
  pharmacyId: number
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
  drugId?: number
  pharmacyId?: number
  batchNumber?: string
  unfrozenOnly?: boolean
  lowStockOnly?: boolean
  page?: number
  pageSize?: number
}

export type InventoryCreateRequest = {
  drugId: number
  pharmacyId: number
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
  drugId: number
  pharmacyId: number
  batchNumber: string
  quantity: number
  unitPrice: number
  storageLocation?: string
  validFrom: string
  validTo: string
  reason?: string
}

export type InventoryOutboundRequest = {
  drugId: number
  pharmacyId: number
  batchNumber: string
  quantity: number
  unitPrice: number
  reason?: string
  referenceId?: string
}

export const getInventoryList = (params?: InventoryQueryParams) =>
  http.get<PaginatedResponse<Inventory>>("/inventory", params)

export const getInventoryById = (id: number) => http.get<Inventory>(`/inventory/${id}`)

export const updateInventory = (id: number, data: InventoryUpdateRequest) => http.put<Inventory>(`/inventory/${id}`, data)

export const deleteInventory = (id: number) => http.delete(`/inventory/${id}`)

export const batchDeleteInventory = (ids: number[]) => http.delete("/inventory", { data: { ids } })

export const inventoryInbound = (data: InventoryInboundRequest) => http.post("/inventory/inbound", data)

export const inventoryOutbound = (data: InventoryOutboundRequest) => http.post("/inventory/outbound", data)

export const getInventoryTransactions = (params: InventoryQueryParams) => http.get<any[]>("/inventory/transactions", params)
