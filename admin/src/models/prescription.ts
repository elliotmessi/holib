import { useRequest, usePagination } from "alova/client"
import { message } from "antd"
import { 
  getPrescriptionList, 
  getPrescriptionById, 
  reviewPrescription, 
  cancelPrescription,
  getPendingReviewPrescriptions,
  PrescriptionQueryParams
} from "@/services/prescription"

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
      reload
    } = usePagination((page, pageSize) => getPrescriptionList({ ...params, page, pageSize }), {
      initialPage: 1,
      initialPageSize: 10,
      data: (response) => response?.list || [],
      total: (response) => response?.total || 0
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
        }
      },
      refresh,
      reload
    }
  }

  // 获取处方详情
  const usePrescriptionDetail = (id?: string) => {
    const { data, loading, send } = useRequest(() => getPrescriptionById(id || ""), {
      immediate: !!id
    })

    return {
      prescriptionDetail: data,
      loading,
      fetchDetail: send
    }
  }

  // 待审核处方列表
  const usePendingReviewPrescriptions = (params?: { pharmacyId?: string }) => {
    const {
      data: pendingList,
      total,
      page,
      pageSize,
      fetching: loading,
      refresh,
      reload
    } = usePagination((page, pageSize) => getPendingReviewPrescriptions({ ...params, page, pageSize }), {
      initialPage: 1,
      initialPageSize: 10,
      data: (response) => response?.list || [],
      total: (response) => response?.total || 0
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
        }
      },
      refresh,
      reload
    }
  }

  // 审核处方
  const useReviewPrescription = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest((id: string, reviewStatus: number, reviewOpinion?: string) => reviewPrescription(id, { reviewStatus, reviewOpinion }), {
      immediate: false
    })
      .onSuccess(() => {
        message.success("处方审核成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`处方审核失败: ${err.message}`)
        error()
      })

    const submitReview = (id: string, reviewStatus: number, reviewOpinion?: string) => {
      send(id, reviewStatus, reviewOpinion)
    }

    return {
      submitReview,
      loading
    }
  }

  // 取消处方
  const useCancelPrescription = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(cancelPrescription, {
      immediate: false
    })
      .onSuccess(() => {
        message.success("处方取消成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`处方取消失败: ${err.message}`)
        error()
      })

    const submitCancel = (id: string) => {
      send(id)
    }

    return {
      submitCancel,
      loading
    }
  }

  return {
    usePrescriptionList,
    usePrescriptionDetail,
    usePendingReviewPrescriptions,
    useReviewPrescription,
    useCancelPrescription
  }
}