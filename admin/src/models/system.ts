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
  getSystemParamList,
  updateSystemParam,
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
    const {
      data: dictTypeList,
      total,
      page,
      pageSize,
      fetching: loading,
      refresh,
      reload,
    } = usePagination((page, pageSize) => getDictTypeList({ ...params, page, pageSize }), {
      initialPage: 1,
      initialPageSize: 10,
      data: response => response?.list || [],
      total: response => response?.total || 0,
    })

    return {
      dictTypeList: dictTypeList || [],
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

  // 获取字典类型详情
  const useDictTypeDetail = (id?: string) => {
    const { data, loading, send } = useRequest(() => getDictTypeById(id || ""), {
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
    const { send, loading } = useRequest((id: string, data: DictTypeUpdateRequest) => updateDictType(id, data), {
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

    const submitUpdate = (id: string, data: DictTypeUpdateRequest) => {
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
    const { send, loading } = useRequest(deleteDictType, {
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

    const submitDelete = (id: string) => {
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
    const { send, loading } = useRequest(batchDeleteDictType, {
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

    const submitBatchDelete = (ids: string[]) => {
      send(ids)
    }

    return {
      submitBatchDelete,
      loading,
    }
  }

  // 字典项列表
  const useDictItemList = (params?: Omit<DictItemQueryParams, "typeCode"> & { typeCode?: string }) => {
    const {
      data: dictItemList,
      total,
      page,
      pageSize,
      fetching: loading,
      refresh,
      reload,
    } = usePagination((page, pageSize) => getDictItemList({ ...params, page, pageSize } as DictItemQueryParams), {
      initialPage: 1,
      initialPageSize: 10,
      data: response => response?.list || [],
      total: response => response?.total || 0,
    })

    return {
      dictItemList: dictItemList || [],
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

  // 获取字典项详情
  const useDictItemDetail = (id?: string) => {
    const { data, loading, send } = useRequest(() => getDictItemById(id || ""), {
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
    const { send, loading } = useRequest((id: string, data: DictItemUpdateRequest) => updateDictItem(id, data), {
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

    const submitUpdate = (id: string, data: DictItemUpdateRequest) => {
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
    const { send, loading } = useRequest(deleteDictItem, {
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

    const submitDelete = (id: string) => {
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
    const { send, loading } = useRequest(batchDeleteDictItem, {
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

    const submitBatchDelete = (ids: string[]) => {
      send(ids)
    }

    return {
      submitBatchDelete,
      loading,
    }
  }

  // 在线用户列表
  const useOnlineUserList = (params?: OnlineUserQueryParams) => {
    const {
      data: onlineUserList,
      total,
      page,
      pageSize,
      fetching: loading,
      refresh,
      reload,
    } = usePagination((page, pageSize) => getOnlineUserList({ ...params, page, pageSize }), {
      initialPage: 1,
      initialPageSize: 10,
      data: response => response?.list || [],
      total: response => response?.total || 0,
    })

    return {
      onlineUserList: onlineUserList || [],
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

  // 强制用户退出
  const useForceLogout = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(forceLogout, {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("用户已强制退出")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`强制退出失败: ${err.message}`)
        error()
      })

    const submitForceLogout = (id: string) => {
      send(id)
    }

    return {
      submitForceLogout,
      loading,
    }
  }

  // 登录日志列表
  const useLoginLogList = (params?: LoginLogQueryParams) => {
    const {
      data: loginLogList,
      total,
      page,
      pageSize,
      fetching: loading,
      refresh,
      reload,
    } = usePagination((page, pageSize) => getLoginLogList({ ...params, page, pageSize }), {
      initialPage: 1,
      initialPageSize: 10,
      data: response => response?.list || [],
      total: response => response?.total || 0,
    })

    return {
      loginLogList: loginLogList || [],
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

  // 系统参数列表
  const useSystemParamList = (params?: SystemParamQueryParams) => {
    const {
      data: systemParamList,
      total,
      page,
      pageSize,
      fetching: loading,
      refresh,
      reload,
    } = usePagination((page, pageSize) => getSystemParamList({ ...params, page, pageSize }), {
      initialPage: 1,
      initialPageSize: 10,
      data: response => response?.list || [],
      total: response => response?.total || 0,
    })

    return {
      systemParamList: systemParamList || [],
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

  // 更新系统参数
  const useUpdateSystemParam = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest((id: string, data: SystemParamUpdateRequest) => updateSystemParam(id, data), {
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

    const submitUpdate = (id: string, data: SystemParamUpdateRequest) => {
      send(id, data)
    }

    return {
      submitUpdate,
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
    useSystemParamList,
    useUpdateSystemParam,
  }
}
