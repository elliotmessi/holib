import { useRequest, usePagination } from "alova/client"
import { message } from "antd"
import { inventory, InventoryQueryParams, InventoryUpdateRequest, InventoryInboundRequest, InventoryOutboundRequest } from "@/services/inventory"

export default () => {
  // 库存列表
  const useInventoryList = (params?: InventoryQueryParams) => {
    const {
      data: inventoryList,
      total,
      page,
      pageSize,
      fetching: loading,
      refresh,
      reload,
    } = usePagination((page, pageSize) => inventory.getList({ ...params, page, pageSize }), {
      initialPage: 1,
      initialPageSize: 10,
      data: (response: any) => response?.list || [],
      total: (response: any) => response?.total || 0,
    })

    return {
      inventoryList: inventoryList || [],
      total: total || 0,
      loading,
      pagination: {
        page,
        pageSize,
        total: total || 0,
        onChange: (newPage: number, newPageSize: number) => {
          reload()
        },
      },
      refresh,
      reload,
    }
  }

  // 获取库存详情
  const useInventoryDetail = (id?: string) => {
    const { data, loading, send } = useRequest(() => inventory.getDetail(id || ""), {
      immediate: !!id,
    })

    return {
      inventoryDetail: data,
      loading,
      fetchDetail: send,
    }
  }

  // 低库存预警列表
  const useLowStockInventory = (params?: { pharmacyId?: string }) => {
    const {
      data: lowStockList,
      total,
      page,
      pageSize,
      fetching: loading,
      refresh,
      reload,
    } = usePagination((page, pageSize) => inventory.getList({ ...params, page, pageSize, filter: "stockLevel:lt:minThreshold" }), {
      initialPage: 1,
      initialPageSize: 10,
      data: (response: any) => response?.list || [],
      total: (response: any) => response?.total || 0,
    })

    return {
      lowStockList: lowStockList || [],
      total: total || 0,
      loading,
      pagination: {
        page,
        pageSize,
        total: total || 0,
        onChange: (newPage: number, newPageSize: number) => {
          reload()
        },
      },
      refresh,
      reload,
    }
  }

  // 近效期预警列表
  const useExpiringInventory = (params?: { days?: number }) => {
    const {
      data: expiringList,
      total,
      page,
      pageSize,
      fetching: loading,
      refresh,
      reload,
    } = usePagination((page, pageSize) => inventory.getList({ ...params, page, pageSize, filter: 'expiring:true' }), {
      initialPage: 1,
      initialPageSize: 10,
      data: (response: any) => response?.list || [],
      total: (response: any) => response?.total || 0,
    })

    return {
      expiringList: expiringList || [],
      total: total || 0,
      loading,
      pagination: {
        page,
        pageSize,
        total: total || 0,
        onChange: (newPage: number, newPageSize: number) => {
          reload()
        },
      },
      refresh,
      reload,
    }
  }

  // 更新库存
  const useUpdateInventory = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest((id: string, data: InventoryUpdateRequest) => inventory.update(id, data), {
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

    const submitUpdate = (id: string, data: InventoryUpdateRequest) => {
      send(id, data)
    }

    return {
      submitUpdate,
      loading,
    }
  }

  // 库存入库
  const useInventoryInbound = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(inventory.inbound, {
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

  // 库存出库
  const useInventoryOutbound = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(inventory.outbound, {
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

  // 删除库存
  const useDeleteInventory = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest((id: string) => inventory.delete(id), {
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

    const submitDelete = (id: string) => {
      send(id)
    }

    return {
      submitDelete,
      loading,
    }
  }

  // 批量删除库存
  const useBatchDeleteInventory = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest((ids: string[]) => inventory.batchDelete(ids), {
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

    const submitBatchDelete = (ids: string[]) => {
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
