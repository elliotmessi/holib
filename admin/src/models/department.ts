import { useRequest, usePagination } from "alova/client"
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
  DepartmentUpdateRequest
} from "@/services/department"

export default () => {
  // 科室列表
  const useDepartmentList = (params?: DepartmentQueryParams) => {
    const {
      data: departmentList,
      total,
      page,
      pageSize,
      fetching: loading,
      refresh,
      reload
    } = usePagination((page, pageSize) => getDepartmentList({ ...params, page, pageSize }), {
      initialPage: 1,
      initialPageSize: 10,
      data: (response) => response?.list || [],
      total: (response) => response?.total || 0
    })

    return {
      departmentList: departmentList || [],
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

  // 获取科室详情
  const useDepartmentDetail = (id?: string) => {
    const { data, loading, send } = useRequest(() => getDepartmentById(id || ""), {
      immediate: !!id
    })

    return {
      departmentDetail: data,
      loading,
      fetchDetail: send
    }
  }

  // 创建科室
  const useCreateDepartment = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(createDepartment, {
      immediate: false
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
      loading
    }
  }

  // 更新科室
  const useUpdateDepartment = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest((id: string, data: DepartmentUpdateRequest) => updateDepartment(id, data), {
      immediate: false
    })
      .onSuccess(() => {
        message.success("科室更新成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`科室更新失败: ${err.message}`)
        error()
      })

    const submitUpdate = (id: string, data: DepartmentUpdateRequest) => {
      send(id, data)
    }

    return {
      submitUpdate,
      loading
    }
  }

  // 删除科室
  const useDeleteDepartment = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(deleteDepartment, {
      immediate: false
    })
      .onSuccess(() => {
        message.success("科室删除成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`科室删除失败: ${err.message}`)
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

  // 批量删除科室
  const useBatchDeleteDepartment = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(batchDeleteDepartment, {
      immediate: false
    })
      .onSuccess(() => {
        message.success("科室批量删除成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`科室批量删除失败: ${err.message}`)
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
    useDepartmentList,
    useDepartmentDetail,
    useCreateDepartment,
    useUpdateDepartment,
    useDeleteDepartment,
    useBatchDeleteDepartment
  }
}