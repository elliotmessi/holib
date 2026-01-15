import { useRequest, usePagination } from "alova/client"
import { message } from "antd"
import { 
  getHospitalList, 
  getHospitalById, 
  createHospital, 
  updateHospital, 
  deleteHospital, 
  batchDeleteHospital,
  HospitalQueryParams,
  HospitalCreateRequest,
  HospitalUpdateRequest
} from "@/services/hospital"

export default () => {
  // 医院列表
  const useHospitalList = (params?: HospitalQueryParams) => {
    const {
      data: hospitalList,
      total,
      page,
      pageSize,
      fetching: loading,
      refresh,
      reload
    } = usePagination((page, pageSize) => getHospitalList({ ...params, page, pageSize }), {
      initialPage: 1,
      initialPageSize: 10,
      data: (response) => response?.list || [],
      total: (response) => response?.total || 0
    })

    return {
      hospitalList: hospitalList || [],
      total: total || 0,
      loading,
      pagination: {
        page,
        pageSize,
        total: total || 0,
        onChange: (newPage: number, newPageSize: number) => {
          // Alova会自动处理分页变化，不需要手动调用setPage/setPageSize
          reload()
        }
      },
      refresh,
      reload
    }
  }

  // 获取医院详情
  const useHospitalDetail = (id?: string) => {
    const { data, loading, send } = useRequest(() => getHospitalById(id || ""), {
      immediate: !!id
    })

    return {
      hospitalDetail: data,
      loading,
      fetchDetail: send
    }
  }

  // 创建医院
  const useCreateHospital = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(createHospital, {
      immediate: false
    })
      .onSuccess(() => {
        message.success("医院创建成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`医院创建失败: ${err.message}`)
        error()
      })

    const submitCreate = (data: HospitalCreateRequest) => {
      send(data)
    }

    return {
      submitCreate,
      loading
    }
  }

  // 更新医院
  const useUpdateHospital = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest((id: string, data: HospitalUpdateRequest) => updateHospital(id, data), {
      immediate: false
    })
      .onSuccess(() => {
        message.success("医院更新成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`医院更新失败: ${err.message}`)
        error()
      })

    const submitUpdate = (id: string, data: HospitalUpdateRequest) => {
      send(id, data)
    }

    return {
      submitUpdate,
      loading
    }
  }

  // 删除医院
  const useDeleteHospital = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(deleteHospital, {
      immediate: false
    })
      .onSuccess(() => {
        message.success("医院删除成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`医院删除失败: ${err.message}`)
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

  // 批量删除医院
  const useBatchDeleteHospital = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(batchDeleteHospital, {
      immediate: false
    })
      .onSuccess(() => {
        message.success("医院批量删除成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`医院批量删除失败: ${err.message}`)
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
    useHospitalList,
    useHospitalDetail,
    useCreateHospital,
    useUpdateHospital,
    useDeleteHospital,
    useBatchDeleteHospital
  }
}