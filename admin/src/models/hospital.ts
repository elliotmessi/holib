import { usePagination, useRequest } from "alova/client"
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
  HospitalUpdateRequest,
} from "@/services/hospital"
import usePaginatedList from "@/hooks/usePaginatedList"

export default () => {
  const useHospitalList = (params?: HospitalQueryParams) =>  usePaginatedList(getHospitalList, { params })
  

  const useHospitalDetail = (id?: number) => {
    const { data, loading, send } = useRequest(() => getHospitalById(id || 0), {
      immediate: !!id,
    })

    return {
      hospitalDetail: data,
      loading,
      fetchDetail: send,
    }
  }

  const useCreateHospital = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(createHospital, {
      immediate: false,
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
      loading,
    }
  }

  const useUpdateHospital = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest((id: number, data: HospitalUpdateRequest) => updateHospital(id, data), {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("医院更新成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`医院更新失败: ${err.message}`)
        error()
      })

    const submitUpdate = (id: number, data: HospitalUpdateRequest) => {
      send(id, data)
    }

    return {
      submitUpdate,
      loading,
    }
  }

  const useDeleteHospital = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(deleteHospital, {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("医院删除成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`医院删除失败: ${err.message}`)
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

  const useBatchDeleteHospital = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(batchDeleteHospital, {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("医院批量删除成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`医院批量删除失败: ${err.message}`)
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
    useHospitalList,
    useHospitalDetail,
    useCreateHospital,
    useUpdateHospital,
    useDeleteHospital,
    useBatchDeleteHospital,
  }
}
