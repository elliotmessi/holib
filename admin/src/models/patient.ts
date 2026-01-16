import { useRequest, usePagination } from "alova/client"
import { message } from "antd"
import { getPatientList, getPatientById, createPatient, updatePatient, deletePatient, batchDeletePatient, PatientQueryParams, PatientCreateRequest, PatientUpdateRequest } from "@/services/patient"

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
    } = usePagination((page, pageSize) => getPatientList({ ...params, page, pageSize }), {
      initialPage: 1,
      initialPageSize: 10,
      data: (response: any) => response || [],
      total: (response: any) => response?.length || 0,
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
  const usePatientDetail = (id?: number) => {
    const { data, loading, send } = useRequest(() => getPatientById(id || 0), {
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
    const { send, loading } = useRequest(createPatient, {
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
    const { send, loading } = useRequest((id: number, data: PatientUpdateRequest) => updatePatient(id, data), {
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

    const submitUpdate = (id: number, data: PatientUpdateRequest) => {
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
    const { send, loading } = useRequest(deletePatient, {
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

    const submitDelete = (id: number) => {
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
    const { send, loading } = useRequest(batchDeletePatient, {
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

    const submitBatchDelete = (ids: number[]) => {
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
