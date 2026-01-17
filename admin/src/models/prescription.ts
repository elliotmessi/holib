import { useRequest, usePagination } from "alova/client"
import { message } from "antd"
import {
  getPrescriptionList,
  getPrescriptionById,
  createPrescription,
  updatePrescription,
  deletePrescription,
  batchDeletePrescription,
  reviewPrescription,
  cancelPrescription,
  PrescriptionQueryParams,
  PrescriptionCreateRequest,
  PrescriptionUpdateRequest,
  PrescriptionReviewRequest,
} from "@/services/prescription"
import usePaginatedList from "@/hooks/usePaginatedList"

export default () => {
  const usePrescriptionList = (params?: PrescriptionQueryParams) => usePaginatedList(getPrescriptionList, { params })

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

  const usePendingReviewPrescriptions = (params?: { pharmacyId?: number }) => {
    return usePagination(
      (page, pageSize) => getPrescriptionList({ ...params, page, pageSize, filter: "status:eq:pending_review" } as PrescriptionQueryParams),
      {
        page: 1,
        pageSize: 10,
      }
    )
  }

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
