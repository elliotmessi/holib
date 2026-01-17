import { useRequest } from "alova/client"
import { message } from "antd"
import {
  getDoctorList,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  batchDeleteDoctor,
  DoctorQueryParams,
  DoctorCreateRequest,
  DoctorUpdateRequest,
  Doctor,
} from "@/services/doctor"
import usePaginatedList from "@/hooks/usePaginatedList"

export default () => {
  const useDoctorList = (params?: DoctorQueryParams) => usePaginatedList(getDoctorList, { params })

  const useDoctorDetail = (id?: number) => {
    const { data, loading, send } = useRequest(() => getDoctorById(id || 0), {
      immediate: !!id,
    })

    return {
      doctorDetail: data,
      loading,
      fetchDetail: send,
    }
  }

  const useCreateDoctor = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(createDoctor, {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("医生创建成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`医生创建失败: ${err.message}`)
        error()
      })

    const submitCreate = (data: DoctorCreateRequest) => {
      send(data)
    }

    return {
      submitCreate,
      loading,
    }
  }

  const useUpdateDoctor = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest((id: number, data: DoctorUpdateRequest) => updateDoctor(id, data), {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("医生更新成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`医生更新失败: ${err.message}`)
        error()
      })

    const submitUpdate = (id: number, data: DoctorUpdateRequest) => {
      send(id, data)
    }

    return {
      submitUpdate,
      loading,
    }
  }

  const useDeleteDoctor = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(deleteDoctor, {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("医生删除成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`医生删除失败: ${err.message}`)
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

  const useBatchDeleteDoctor = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(batchDeleteDoctor, {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("医生批量删除成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`医生批量删除失败: ${err.message}`)
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
    useDoctorList,
    useDoctorDetail,
    useCreateDoctor,
    useUpdateDoctor,
    useDeleteDoctor,
    useBatchDeleteDoctor,
  }
}
