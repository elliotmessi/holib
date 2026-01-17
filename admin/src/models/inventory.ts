import { useRequest, usePagination } from "alova/client"
import { message } from "antd"
import {
  getInventoryList,
  getInventoryById,
  updateInventory,
  deleteInventory,
  batchDeleteInventory,
  inventoryInbound,
  inventoryOutbound,
  InventoryQueryParams,
  InventoryUpdateRequest,
  InventoryInboundRequest,
  InventoryOutboundRequest,
} from "@/services/inventory"
import usePaginatedList from "@/hooks/usePaginatedList"

export default () => {
  const useInventoryList = (params?: InventoryQueryParams) => usePaginatedList(getInventoryList, { params })

  const useInventoryDetail = (id?: number) => {
    const { data, loading, send } = useRequest(() => getInventoryById(id || 0), {
      immediate: !!id,
    })

    return {
      inventoryDetail: data,
      loading,
      fetchDetail: send,
    }
  }

  const useLowStockInventory = (params?: { pharmacyId?: number }) => {
    return usePagination((page, pageSize) => getInventoryList({ ...params, page, pageSize, filter: "stockLevel:lt:minThreshold" } as InventoryQueryParams), {
      page: 1,
      pageSize: 10,
    })
  }

  const useExpiringInventory = (params?: { days?: number }) => {
    return usePagination((page, pageSize) => getInventoryList({ ...params, page, pageSize, filter: "expiring:true" } as InventoryQueryParams), {
      page: 1,
      pageSize: 10,
    })
  }

  const useUpdateInventory = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest((id: number, data: InventoryUpdateRequest) => updateInventory(id, data), {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("库存更新成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`库存更新失败: ${err.message}`)
        error()
      })

    const submitUpdate = (id: number, data: InventoryUpdateRequest) => {
      send(id, data)
    }

    return {
      submitUpdate,
      loading,
    }
  }

  const useInventoryInbound = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(inventoryInbound, {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("库存入库成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`库存入库失败: ${err.message}`)
        error()
      })

    const submitInbound = (data: InventoryInboundRequest) => {
      send(data)
    }

    return {
      submitInbound,
      loading,
    }
  }

  const useInventoryOutbound = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(inventoryOutbound, {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("库存出库成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`库存出库失败: ${err.message}`)
        error()
      })

    const submitOutbound = (data: InventoryOutboundRequest) => {
      send(data)
    }

    return {
      submitOutbound,
      loading,
    }
  }

  const useDeleteInventory = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest((id: number) => deleteInventory(id), {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("库存删除成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`库存删除失败: ${err.message}`)
        error()
      })

    const submitDelete = (id: number) => {
      send(id)
    }

    return {
      submitDelete,
      loading,
    }
  }

  const useBatchDeleteInventory = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest((ids: number[]) => batchDeleteInventory(ids), {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("库存批量删除成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`库存批量删除失败: ${err.message}`)
        error()
      })

    const submitBatchDelete = (ids: number[]) => {
      send(ids)
    }

    return {
      submitBatchDelete,
      loading,
    }
  }

  return {
    useInventoryList,
    useInventoryDetail,
    useLowStockInventory,
    useExpiringInventory,
    useUpdateInventory,
    useInventoryInbound,
    useInventoryOutbound,
    useDeleteInventory,
    useBatchDeleteInventory,
  }
}
