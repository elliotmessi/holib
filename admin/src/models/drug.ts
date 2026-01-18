import { useRequest } from "alova/client"
import { message } from "antd"
import {
  getDrugList,
  getDrugById,
  createDrug,
  updateDrug,
  deleteDrug,
  batchDeleteDrug,
  DrugQueryParams,
  DrugCreateRequest,
  DrugUpdateRequest,
  Drug,
} from "@/services/drug"
import usePaginatedList from "@/hooks/usePaginatedList"

export default () => {
  const useDrugList = (params?: DrugQueryParams) => {
    const result = usePaginatedList(getDrugList, { params })
    return {
      ...result,
      drugList: result.data,
      pagination: {
        total: result.total,
        current: result.page,
        pageSize: result.pageSize,
      },
    }
  }

  const useDrugDetail = (id?: number) => {
    const { data, loading, send } = useRequest(() => getDrugById(id || 0), {
      immediate: !!id,
    })

    return {
      drugDetail: data,
      loading,
      fetchDetail: send,
    }
  }

  const useCreateDrug = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(createDrug, {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("药品创建成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`药品创建失败: ${err.message}`)
        error()
      })

    const submitCreate = (data: DrugCreateRequest) => {
      send(data)
    }

    return {
      submitCreate,
      loading,
    }
  }

  const useUpdateDrug = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest((id: number, data: DrugUpdateRequest) => updateDrug(id, data), {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("药品更新成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`药品更新失败: ${err.message}`)
        error()
      })

    const submitUpdate = (id: number, data: DrugUpdateRequest) => {
      send(id, data)
    }

    return {
      submitUpdate,
      loading,
    }
  }

  const useDeleteDrug = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(deleteDrug, {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("药品删除成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`药品删除失败: ${err.message}`)
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

  const useBatchDeleteDrug = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(batchDeleteDrug, {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("药品批量删除成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`药品批量删除失败: ${err.message}`)
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
    useDrugList,
    useDrugDetail,
    useCreateDrug,
    useUpdateDrug,
    useDeleteDrug,
    useBatchDeleteDrug,
  }
}
