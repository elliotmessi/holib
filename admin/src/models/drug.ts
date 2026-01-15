import { drugs } from "@/services/drug"

export default () => {
  // 药品列表
  const useDrugList = () => {
    return {
      drugList: [],
      total: 0,
      loading: false,
      pagination: {
        current: 1,
        pageSize: 20,
        onChange: () => {},
        onShowSizeChange: () => {},
      },
      refresh: async () => {},
    }
  }

  // 药品详情
  const useDrugDetail = (id: string) => {
    return {
      drugDetail: {},
      loading: false,
    }
  }

  // 创建药品
  const useCreateDrug = (options: { success?: () => void }) => {
    return {
      submitCreate: async (data: any) => {
        try {
          await drugs.create(data)
          options.success?.()
        } catch (error) {
          console.error("创建药品失败:", error)
        }
      },
      loading: false,
    }
  }

  // 更新药品
  const useUpdateDrug = (options: { success?: () => void }) => {
    return {
      submitUpdate: async (id: string, data: any) => {
        try {
          await drugs.update(id, data)
          options.success?.()
        } catch (error) {
          console.error("更新药品失败:", error)
        }
      },
      loading: false,
    }
  }

  // 删除药品
  const useDeleteDrug = (options: { success?: () => void }) => {
    return {
      submitDelete: async (id: string) => {
        try {
          await drugs.delete(id)
          options.success?.()
        } catch (error) {
          console.error("删除药品失败:", error)
        }
      },
      loading: false,
    }
  }

  // 批量删除药品
  const useBatchDeleteDrug = (options: { success?: () => void }) => {
    return {
      submitBatchDelete: async (ids: string[]) => {
        try {
          await drugs.batchDelete(ids)
          options.success?.()
        } catch (error) {
          console.error("批量删除药品失败:", error)
        }
      },
      loading: false,
    }
  }

  return {
    useDrugList,
    useDrugDetail,
    useCreateDrug,
    useUpdateDrug,
    useDeleteDrug,
    useBatchDeleteDrug,
  }
}
