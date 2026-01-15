import { useRequest, usePagination } from "alova/client"
import { message } from "antd"
import { pharmacy, PharmacyQueryParams, PharmacyCreateRequest, PharmacyUpdateRequest } from "@/services/pharmacy"

export default () => {
  // 药房列表
  const usePharmacyList = (params?: PharmacyQueryParams) => {
    const {
      data: pharmacyList,
      total,
      page,
      pageSize,
      fetching: loading,
      refresh,
      reload,
    } = usePagination((page, pageSize) => pharmacy.getList({ ...params, page, pageSize }), {
      initialPage: 1,
      initialPageSize: 10,
      data: (response: any) => response?.list || [],
      total: (response: any) => response?.total || 0,
    })

    return {
      pharmacyList: pharmacyList || [],
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

  // 获取药房详情
  const usePharmacyDetail = (id?: string) => {
    const { data, loading, send } = useRequest(() => pharmacy.getDetail(id || ""), {
      immediate: !!id,
    })

    return {
      pharmacyDetail: data,
      loading,
      fetchDetail: send,
    }
  }

  // 创建药房
  const useCreatePharmacy = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(pharmacy.create, {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("药房创建成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`药房创建失败: ${err.message}`)
        error()
      })

    const submitCreate = (data: PharmacyCreateRequest) => {
      send(data)
    }

    return {
      submitCreate,
      loading,
    }
  }

  // 更新药房
  const useUpdatePharmacy = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest((id: string, data: PharmacyUpdateRequest) => pharmacy.update(id, data), {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("药房更新成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`药房更新失败: ${err.message}`)
        error()
      })

    const submitUpdate = (id: string, data: PharmacyUpdateRequest) => {
      send(id, data)
    }

    return {
      submitUpdate,
      loading,
    }
  }

  // 删除药房
  const useDeletePharmacy = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(pharmacy.delete, {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("药房删除成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`药房删除失败: ${err.message}`)
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

  // 批量删除药房
  const useBatchDeletePharmacy = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(pharmacy.batchDelete, {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("药房批量删除成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`药房批量删除失败: ${err.message}`)
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
    usePharmacyList,
    usePharmacyDetail,
    useCreatePharmacy,
    useUpdatePharmacy,
    useDeletePharmacy,
    useBatchDeletePharmacy,
  }
}
