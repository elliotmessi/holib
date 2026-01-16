import { useRequest, usePagination } from "alova/client"
import { message } from "antd"
import { getPrescriptionList, getPrescriptionById, createPrescription, updatePrescription, deletePrescription, batchDeletePrescription, reviewPrescription, cancelPrescription, PrescriptionQueryParams, PrescriptionCreateRequest, PrescriptionUpdateRequest, PrescriptionReviewRequest } from "@/services/prescription"

export default () => {
  // 处方列表
  const usePrescriptionList = (params?: PrescriptionQueryParams) => {
    const {
      data: prescriptionList,
      total,
      page,
      pageSize,
      fetching: loading,
      refresh,
      reload,
    } = usePagination((page, pageSize) => getPrescriptionList({ ...params, page, pageSize }), {
      initialPage: 1,
      initialPageSize: 10,
      data: (response: any) => response || [],
      total: (response: any) => response?.length || 0,
    })

    return {
      prescriptionList: prescriptionList || [],
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

  // 获取处方详情
  const usePrescriptionDetail = (id?: number) => {
    const { data, loading, send } = useRequest(() => getPrescriptionById(id || 0), {
      immediate: !!id,
    })

    return {
      prescriptionDetail: data,
      loading,
      fetchDetail: send,
    }
  }

  // 待审核处方列表
  const usePendingReviewPrescriptions = (params?: { pharmacyId?: number }) => {
    const {
      data: pendingList,
      total,
      page,
      pageSize,
      fetching: loading,
      refresh,
      reload,
    } = usePagination((page, pageSize) => getPrescriptionList({ ...params, page, pageSize, filter: "status:eq:pending_review" }), {
      initialPage: 1,
      initialPageSize: 10,
      data: (response: any) => response || [],
      total: (response: any) => response?.length || 0,
    })

    return {
      pendingList: pendingList || [],
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

  // 审核处方
  const useReviewPrescription = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest((id: number, data: PrescriptionReviewRequest) => reviewPrescription(id, data), {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("处方审核成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`处方审核失败: ${err.message}`)
        error()
      })

    const submitReview = (id: number, data: PrescriptionReviewRequest) => {
      send(id, data)
    }

    return {
      submitReview,
      loading,
    }
  }

  // 取消处方
  const useCancelPrescription = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest((id: number) => cancelPrescription(id), {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("处方取消成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`处方取消失败: ${err.message}`)
        error()
      })

    const submitCancel = (id: number) => {
      send(id)
    }

    return {
      submitCancel,
      loading,
    }
  }

  // 创建处方
  const useCreatePrescription = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(createPrescription, {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("处方创建成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`处方创建失败: ${err.message}`)
        error()
      })

    const submitCreate = (data: PrescriptionCreateRequest) => {
      send(data)
    }

    return {
      submitCreate,
      loading,
    }
  }

  // 更新处方
  const useUpdatePrescription = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest((id: number, data: PrescriptionUpdateRequest) => updatePrescription(id, data), {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("处方更新成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`处方更新失败: ${err.message}`)
        error()
      })

    const submitUpdate = (id: number, data: PrescriptionUpdateRequest) => {
      send(id, data)
    }

    return {
      submitUpdate,
      loading,
    }
  }

  // 删除处方
  const useDeletePrescription = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest((id: number) => deletePrescription(id), {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("处方删除成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`处方删除失败: ${err.message}`)
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

  // 批量删除处方
  const useBatchDeletePrescription = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest((ids: number[]) => batchDeletePrescription(ids), {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("处方批量删除成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`处方批量删除失败: ${err.message}`)
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
    usePrescriptionList,
    usePrescriptionDetail,
    usePendingReviewPrescriptions,
    useReviewPrescription,
    useCancelPrescription,
    useCreatePrescription,
    useUpdatePrescription,
    useDeletePrescription,
    useBatchDeletePrescription,
  }
}
