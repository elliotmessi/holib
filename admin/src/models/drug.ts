import { useRequest, usePagination } from "alova/client"
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
  DrugUpdateRequest
} from "@/services/drug"

export default () => {
  // 药品列表
  const useDrugList = (params?: DrugQueryParams) => {
    const {
      data: drugList,
      total,
      page,
      pageSize,
      fetching: loading,
      refresh,
      reload
    } = usePagination((page, pageSize) => getDrugList({ ...params, page, pageSize }), {
      initialPage: 1,
      initialPageSize: 10,
      data: (response) => response?.list || [],
      total: (response) => response?.total || 0
    })

    return {
      drugList: drugList || [],
      total: total || 0,
      loading,
      pagination: {
        page,
        pageSize,
        total: total || 0,
        onChange: (newPage: number, newPageSize: number) => {
          reload()
        }
      },
      refresh,
      reload
    }
  }

  // 获取药品详情
  const useDrugDetail = (id?: string) => {
    const { data, loading, send } = useRequest(() => getDrugById(id || ""), {
      immediate: !!id
    })

    return {
      drugDetail: data,
      loading,
      fetchDetail: send
    }
  }

  // 创建药品
  const useCreateDrug = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(createDrug, {
      immediate: false
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
      loading
    }
  }

  // 更新药品
  const useUpdateDrug = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest((id: string, data: DrugUpdateRequest) => updateDrug(id, data), {
      immediate: false
    })
      .onSuccess(() => {
        message.success("药品更新成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`药品更新失败: ${err.message}`)
        error()
      })

    const submitUpdate = (id: string, data: DrugUpdateRequest) => {
      send(id, data)
    }

    return {
      submitUpdate,
      loading
    }
  }

  // 删除药品
  const useDeleteDrug = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(deleteDrug, {
      immediate: false
    })
      .onSuccess(() => {
        message.success("药品删除成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`药品删除失败: ${err.message}`)
        error()
      })

    const submitDelete = (id: string) => {
      send(id)
    }

    return {
      submitDelete,
      loading
    }
  }

  // 批量删除药品
  const useBatchDeleteDrug = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(batchDeleteDrug, {
      immediate: false
    })
      .onSuccess(() => {
        message.success("药品批量删除成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`药品批量删除失败: ${err.message}`)
        error()
      })

    const submitBatchDelete = (ids: string[]) => {
      send(ids)
    }

    return {
      submitBatchDelete,
      loading
    }
  }

  return {
    useDrugList,
    useDrugDetail,
    useCreateDrug,
    useUpdateDrug,
    useDeleteDrug,
    useBatchDeleteDrug
  }
}