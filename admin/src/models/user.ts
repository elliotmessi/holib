import { useRequest, usePagination } from "alova/client"
import { message } from "antd"
import {
  getUserList,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  batchDeleteUser,
  updateUserPassword,
  UserQueryParams,
  UserCreateRequest,
  UserUpdateRequest
} from "@/services/user"

export default () => {
  // 用户列表
  const useUserList = (params?: UserQueryParams) => {
    const {
      data: userList,
      total,
      page,
      pageSize,
      fetching: loading,
      refresh,
      reload
    } = usePagination((page, pageSize) => getUserList({ ...params, page, pageSize }), {
      initialPage: 1,
      initialPageSize: 10,
      data: (response) => response || [],
      total: (response) => response?.length || 0
    })

    return {
      userList: userList || [],
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

  // 获取用户详情
  const useUserDetail = (id?: number) => {
    const { data, loading, send } = useRequest(() => getUserById(id || 0), {
      immediate: !!id
    })

    return {
      userDetail: data,
      loading,
      fetchDetail: send
    }
  }

  // 创建用户
  const useCreateUser = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(createUser, {
      immediate: false
    })
      .onSuccess(() => {
        message.success("用户创建成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`用户创建失败: ${err.message}`)
        error()
      })

    const submitCreate = (data: UserCreateRequest) => {
      send(data)
    }

    return {
      submitCreate,
      loading
    }
  }

  // 更新用户
  const useUpdateUser = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest((id: number, data: UserUpdateRequest) => updateUser(id, data), {
      immediate: false
    })
      .onSuccess(() => {
        message.success("用户更新成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`用户更新失败: ${err.message}`)
        error()
      })

    const submitUpdate = (id: number, data: UserUpdateRequest) => {
      send(id, data)
    }

    return {
      submitUpdate,
      loading
    }
  }

  // 删除用户
  const useDeleteUser = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(deleteUser, {
      immediate: false
    })
      .onSuccess(() => {
        message.success("用户删除成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`用户删除失败: ${err.message}`)
        error()
      })

    const submitDelete = (id: number) => {
      send(id)
    }

    return {
      submitDelete,
      loading
    }
  }

  // 批量删除用户
  const useBatchDeleteUser = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(batchDeleteUser, {
      immediate: false
    })
      .onSuccess(() => {
        message.success("用户批量删除成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`用户批量删除失败: ${err.message}`)
        error()
      })

    const submitBatchDelete = (ids: number[]) => {
      send(ids)
    }

    return {
      submitBatchDelete,
      loading
    }
  }

  // 更新用户密码
  const useUpdateUserPassword = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest((id: number, data: { password: string }) => updateUserPassword(id, data), {
      immediate: false
    })
      .onSuccess(() => {
        message.success("密码更新成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`密码更新失败: ${err.message}`)
        error()
      })

    const submitUpdatePassword = (id: number, password: string) => {
      send(id, { password })
    }

    return {
      submitUpdatePassword,
      loading
    }
  }

  return {
    useUserList,
    useUserDetail,
    useCreateUser,
    useUpdateUser,
    useDeleteUser,
    useBatchDeleteUser,
    useUpdateUserPassword
  }
}