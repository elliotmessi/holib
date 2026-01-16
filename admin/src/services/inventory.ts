import http from "@/utils/http"

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

export const getInventoryList = (params: InventoryQueryParams) => http.get<{ list: Inventory[]; total: number }>("/inventory", params)

export const getInventoryById = (id: string) => http.get<Inventory>(`/inventory/${id}`)

export const updateInventory = (id: string, data: InventoryUpdateRequest) => http.put<Inventory>(`/inventory/${id}`, data)

export const deleteInventory = (id: string) => http.delete(`/inventory/${id}`)

export const batchDeleteInventory = (ids: string[]) => http.delete("/inventory", { data: { ids } })

export const inventoryInbound = (data: InventoryInboundRequest) => http.post("/inventory/inbound", data)

export const inventoryOutbound = (data: InventoryOutboundRequest) => http.post("/inventory/outbound", data)

export const getInventoryTransactions = (params: InventoryQueryParams) => http.get<{ list: any[]; total: number }>("/inventory/transactions", params)
