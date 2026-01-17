import { useRequest } from "alova/client"
import { message } from "antd"
import {
  getDepartmentList,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  batchDeleteDepartment,
  DepartmentQueryParams,
  DepartmentCreateRequest,
  DepartmentUpdateRequest,
  Department,
} from "@/services/department"
import usePaginatedList from "@/hooks/usePaginatedList"

export default () => {
  const useDepartmentList = (params?: DepartmentQueryParams) => usePaginatedList(getDepartmentList, { params })

  const useDepartmentDetail = (id?: number) => {
    const { data, loading, send } = useRequest(() => getDepartmentById(id || 0), {
      immediate: !!id,
    })

    return {
      departmentDetail: data,
      loading,
      fetchDetail: send,
    }
  }

  const useCreateDepartment = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(createDepartment, {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("科室创建成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`科室创建失败: ${err.message}`)
        error()
      })

    const submitCreate = (data: DepartmentCreateRequest) => {
      send(data)
    }

    return {
      submitCreate,
      loading,
    }
  }

  const useUpdateDepartment = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest((id: number, data: DepartmentUpdateRequest) => updateDepartment(id, data), {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("科室更新成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`科室更新失败: ${err.message}`)
        error()
      })

    const submitUpdate = (id: number, data: DepartmentUpdateRequest) => {
      send(id, data)
    }

    return {
      submitUpdate,
      loading,
    }
  }

  const useDeleteDepartment = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(deleteDepartment, {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("科室删除成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`科室删除失败: ${err.message}`)
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

  const useBatchDeleteDepartment = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(batchDeleteDepartment, {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("科室批量删除成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`科室批量删除失败: ${err.message}`)
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
    useDepartmentList,
    useDepartmentDetail,
    useCreateDepartment,
    useUpdateDepartment,
    useDeleteDepartment,
    useBatchDeleteDepartment,
  }
}
