import { useRequest, usePagination } from "alova/client"
import { message } from "antd"
import {
  getDictTypeList,
  getDictTypeById,
  createDictType,
  updateDictType,
  deleteDictType,
  batchDeleteDictType,
  getDictItemList,
  getDictItemById,
  createDictItem,
  updateDictItem,
  deleteDictItem,
  batchDeleteDictItem,
  getOnlineUserList,
  forceLogout,
  getLoginLogList,
  deleteLoginLog,
  batchDeleteLoginLog,
  getSystemParamList,
  updateSystemParam,
  deleteSystemParam,
  batchDeleteSystemParam,
  DictTypeQueryParams,
  DictTypeCreateRequest,
  DictTypeUpdateRequest,
  DictItemQueryParams,
  DictItemCreateRequest,
  DictItemUpdateRequest,
  OnlineUserQueryParams,
  LoginLogQueryParams,
  SystemParamQueryParams,
  SystemParamUpdateRequest,
} from "@/services/system"

export default () => {
  // 字典类型列表
  const useDictTypeList = (params?: DictTypeQueryParams) => {
    const result = usePagination((page, pageSize) => getDictTypeList({ ...params, page, pageSize }), {
      initialPage: 1,
      initialPageSize: 10,
    })

    return {
      ...result,
      dictTypeList: result.data,
      pagination: {
        total: result.total,
        current: result.page,
        pageSize: result.pageSize,
      },
    }
  }

  // 获取字典类型详情
  const useDictTypeDetail = (id?: number) => {
    const { data, loading, send } = useRequest(() => getDictTypeById(id || 0), {
      immediate: !!id,
    })

    return {
      dictTypeDetail: data,
      loading,
      fetchDetail: send,
    }
  }

  // 创建字典类型
  const useCreateDictType = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(createDictType, {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("字典类型创建成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`字典类型创建失败: ${err.message}`)
        error()
      })

    const submitCreate = (data: DictTypeCreateRequest) => {
      send(data)
    }

    return {
      submitCreate,
      loading,
    }
  }

  // 更新字典类型
  const useUpdateDictType = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest((id: number, data: DictTypeUpdateRequest) => updateDictType(id, data), {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("字典类型更新成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`字典类型更新失败: ${err.message}`)
        error()
      })

    const submitUpdate = (id: number, data: DictTypeUpdateRequest) => {
      send(id, data)
    }

    return {
      submitUpdate,
      loading,
    }
  }

  // 删除字典类型
  const useDeleteDictType = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest((id: number) => deleteDictType(id), {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("字典类型删除成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`字典类型删除失败: ${err.message}`)
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

  // 批量删除字典类型
  const useBatchDeleteDictType = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest((ids: number[]) => batchDeleteDictType(ids), {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("字典类型批量删除成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`字典类型批量删除失败: ${err.message}`)
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

  // 字典项列表
  const useDictItemList = (params?: DictItemQueryParams) => {
    const result = usePagination((page, pageSize) => getDictItemList({ ...params, page, pageSize }), {
      initialPage: 1,
      initialPageSize: 10,
    })

    return {
      ...result,
      dictItemList: result.data,
      pagination: {
        total: result.total,
        current: result.page,
        pageSize: result.pageSize,
      },
    }
  }

  // 获取字典项详情
  const useDictItemDetail = (id?: number) => {
    const { data, loading, send } = useRequest(() => getDictItemById(id || 0), {
      immediate: !!id,
    })

    return {
      dictItemDetail: data,
      loading,
      fetchDetail: send,
    }
  }

  // 创建字典项
  const useCreateDictItem = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(createDictItem, {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("字典项创建成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`字典项创建失败: ${err.message}`)
        error()
      })

    const submitCreate = (data: DictItemCreateRequest) => {
      send(data)
    }

    return {
      submitCreate,
      loading,
    }
  }

  // 更新字典项
  const useUpdateDictItem = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest((id: number, data: DictItemUpdateRequest) => updateDictItem(id, data), {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("字典项更新成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`字典项更新失败: ${err.message}`)
        error()
      })

    const submitUpdate = (id: number, data: DictItemUpdateRequest) => {
      send(id, data)
    }

    return {
      submitUpdate,
      loading,
    }
  }

  // 删除字典项
  const useDeleteDictItem = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest((id: number) => deleteDictItem(id), {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("字典项删除成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`字典项删除失败: ${err.message}`)
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

  // 批量删除字典项
  const useBatchDeleteDictItem = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest((ids: number[]) => batchDeleteDictItem(ids), {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("字典项批量删除成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`字典项批量删除失败: ${err.message}`)
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

  // 在线用户列表
  const useOnlineUserList = (params?: OnlineUserQueryParams) => {
    const result = usePagination((page, pageSize) => getOnlineUserList({ ...params, page, pageSize }), {
      initialPage: 1,
      initialPageSize: 10,
    })

    return {
      ...result,
      onlineUserList: result.data,
      pagination: {
        total: result.total,
        current: result.page,
        pageSize: result.pageSize,
      },
    }
  }

  // 强制下线用户
  const useForceLogout = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest((userId: string) => forceLogout(userId), {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("强制下线成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`强制下线失败: ${err.message}`)
        error()
      })

    const submitForceLogout = (userId: string) => {
      send(userId)
    }

    return {
      submitForceLogout,
      loading,
    }
  }

  // 登录日志列表
  const useLoginLogList = (params?: LoginLogQueryParams) => {
    const result = usePagination((page, pageSize) => getLoginLogList({ ...params, page, pageSize }), {
      initialPage: 1,
      initialPageSize: 10,
    })

    return {
      ...result,
      loginLogList: result.data,
      pagination: {
        total: result.total,
        current: result.page,
        pageSize: result.pageSize,
      },
    }
  }

  // 删除登录日志
  const useDeleteLoginLog = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest((id: number) => deleteLoginLog(id), {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("登录日志删除成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`登录日志删除失败: ${err.message}`)
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

  // 批量删除登录日志
  const useBatchDeleteLoginLog = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest((ids: number[]) => batchDeleteLoginLog(ids), {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("登录日志批量删除成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`登录日志批量删除失败: ${err.message}`)
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

  // 系统参数列表
  const useSystemParamList = (params?: SystemParamQueryParams) => {
    const result = usePagination((page, pageSize) => getSystemParamList({ ...params, page, pageSize }), {
      initialPage: 1,
      initialPageSize: 10,
    })

    return {
      ...result,
      systemParamList: result.data,
      pagination: {
        total: result.total,
        current: result.page,
        pageSize: result.pageSize,
      },
    }
  }

  // 更新系统参数
  const useUpdateSystemParam = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest((id: number, data: SystemParamUpdateRequest) => updateSystemParam(id, data), {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("系统参数更新成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`系统参数更新失败: ${err.message}`)
        error()
      })

    const submitUpdate = (id: number, data: SystemParamUpdateRequest) => {
      send(id, data)
    }

    return {
      submitUpdate,
      loading,
    }
  }

  // 删除系统参数
  const useDeleteSystemParam = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest((id: number) => deleteSystemParam(id), {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("系统参数删除成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`系统参数删除失败: ${err.message}`)
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

  // 批量删除系统参数
  const useBatchDeleteSystemParam = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest((ids: number[]) => batchDeleteSystemParam(ids), {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("系统参数批量删除成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`系统参数批量删除失败: ${err.message}`)
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
    useDictTypeList,
    useDictTypeDetail,
    useCreateDictType,
    useUpdateDictType,
    useDeleteDictType,
    useBatchDeleteDictType,
    useDictItemList,
    useDictItemDetail,
    useCreateDictItem,
    useUpdateDictItem,
    useDeleteDictItem,
    useBatchDeleteDictItem,
    useOnlineUserList,
    useForceLogout,
    useLoginLogList,
    useDeleteLoginLog,
    useBatchDeleteLoginLog,
    useSystemParamList,
    useUpdateSystemParam,
    useDeleteSystemParam,
    useBatchDeleteSystemParam,
  }
}
