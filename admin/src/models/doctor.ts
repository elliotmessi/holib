import { useRequest, usePagination } from "alova/client"
import { message } from "antd"
import { doctor, DoctorQueryParams, DoctorCreateRequest, DoctorUpdateRequest } from "@/services/doctor"

export default () => {
  // 医生列表
  const useDoctorList = (params?: DoctorQueryParams) => {
    const {
      data: doctorList,
      total,
      page,
      pageSize,
      fetching: loading,
      refresh,
      reload,
    } = usePagination((page, pageSize) => doctor.getList({ ...params, page, pageSize }), {
      initialPage: 1,
      initialPageSize: 10,
      data: (response: any) => response?.list || [],
      total: (response: any) => response?.total || 0,
    })

    return {
      doctorList: doctorList || [],
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

  // 获取医生详情
  const useDoctorDetail = (id?: string) => {
    const { data, loading, send } = useRequest(() => doctor.getDetail(id || ""), {
      immediate: !!id,
    })

    return {
      doctorDetail: data,
      loading,
      fetchDetail: send,
    }
  }

  // 创建医生
  const useCreateDoctor = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(doctor.create, {
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

  // 更新医生
  const useUpdateDoctor = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest((id: string, data: DoctorUpdateRequest) => doctor.update(id, data), {
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

    const submitUpdate = (id: string, data: DoctorUpdateRequest) => {
      send(id, data)
    }

    return {
      submitUpdate,
      loading,
    }
  }

  // 删除医生
  const useDeleteDoctor = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(doctor.delete, {
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

    const submitDelete = (id: string) => {
      send(id)
    }

    return {
      submitDelete,
      loading,
    }
  }

  // 批量删除医生
  const useBatchDeleteDoctor = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(doctor.batchDelete, {
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

    const submitBatchDelete = (ids: string[]) => {
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
