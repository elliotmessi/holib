import { useRequest } from "alova/client"
import { message } from "antd"
import {
  getPharmacyList,
  getPharmacyById,
  createPharmacy,
  updatePharmacy,
  deletePharmacy,
  batchDeletePharmacy,
  PharmacyQueryParams,
  PharmacyCreateRequest,
  PharmacyUpdateRequest,
} from "@/services/pharmacy"
import usePaginatedList from "@/hooks/usePaginatedList"

export default () => {
  const usePharmacyList = (params?: PharmacyQueryParams) => {
    const result = usePaginatedList(getPharmacyList, { params })
    return {
      ...result,
      pharmacyList: result.data,
      pagination: {
        total: result.total,
        current: result.page,
        pageSize: result.pageSize,
      },
    }
  }

  const usePharmacyDetail = (id?: number) => {
    const { data, loading, send } = useRequest(() => getPharmacyById(id || 0), {
      immediate: !!id,
    })

    return {
      pharmacyDetail: data,
      loading,
      fetchDetail: send,
    }
  }

  const useCreatePharmacy = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(createPharmacy, {
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

  const useUpdatePharmacy = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest((id: number, data: PharmacyUpdateRequest) => updatePharmacy(id, data), {
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

    const submitUpdate = (id: number, data: PharmacyUpdateRequest) => {
      send(id, data)
    }

    return {
      submitUpdate,
      loading,
    }
  }

  const useDeletePharmacy = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(deletePharmacy, {
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

    const submitDelete = (id: number) => {
      send(id)
    }

    return {
      submitDelete,
      loading,
    }
  }

  const useBatchDeletePharmacy = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(batchDeletePharmacy, {
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

    const submitBatchDelete = (ids: number[]) => {
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
