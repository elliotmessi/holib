import { useRequest, usePagination } from "alova/client"
import { message } from "antd"
import { patient, PatientQueryParams, PatientCreateRequest, PatientUpdateRequest } from "@/services/patient"

export default () => {
  // 患者列表
  const usePatientList = (params?: PatientQueryParams) => {
    const {
      data: patientList,
      total,
      page,
      pageSize,
      fetching: loading,
      refresh,
      reload,
    } = usePagination((page, pageSize) => patient.getList({ ...params, page, pageSize }), {
      initialPage: 1,
      initialPageSize: 10,
      data: (response: any) => response?.list || [],
      total: (response: any) => response?.total || 0,
    })

    return {
      patientList: patientList || [],
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

  // 获取患者详情
  const usePatientDetail = (id?: string) => {
    const { data, loading, send } = useRequest(() => patient.getDetail(id || ""), {
      immediate: !!id,
    })

    return {
      patientDetail: data,
      loading,
      fetchDetail: send,
    }
  }

  // 创建患者
  const useCreatePatient = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(patient.create, {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("患者创建成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`患者创建失败: ${err.message}`)
        error()
      })

    const submitCreate = (data: PatientCreateRequest) => {
      send(data)
    }

    return {
      submitCreate,
      loading,
    }
  }

  // 更新患者
  const useUpdatePatient = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest((id: string, data: PatientUpdateRequest) => patient.update(id, data), {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("患者更新成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`患者更新失败: ${err.message}`)
        error()
      })

    const submitUpdate = (id: string, data: PatientUpdateRequest) => {
      send(id, data)
    }

    return {
      submitUpdate,
      loading,
    }
  }

  // 删除患者
  const useDeletePatient = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(patient.delete, {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("患者删除成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`患者删除失败: ${err.message}`)
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

  // 批量删除患者
  const useBatchDeletePatient = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(patient.batchDelete, {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("患者批量删除成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`患者批量删除失败: ${err.message}`)
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
    usePatientList,
    usePatientDetail,
    useCreatePatient,
    useUpdatePatient,
    useDeletePatient,
    useBatchDeletePatient,
  }
}
