import { useRequest } from "alova/client"
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
  UserUpdateRequest,
} from "@/services/user"
import usePaginatedList from "@/hooks/usePaginatedList"

export default () => {
  const useUserList = (params?: UserQueryParams) => {
    const result = usePaginatedList(getUserList, { params })
    return {
      ...result,
      userList: result.data,
      pagination: {
        total: result.total,
        current: result.page,
        pageSize: result.pageSize,
      },
    }
  }

  const useUserDetail = (id?: number) => {
    const { data, loading, send } = useRequest(() => getUserById(id || 0), {
      immediate: !!id,
    })

    return {
      userDetail: data,
      loading,
      fetchDetail: send,
    }
  }

  const useCreateUser = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(createUser, {
      immediate: false,
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
      loading,
    }
  }

  const useUpdateUser = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest((id: number, data: UserUpdateRequest) => updateUser(id, data), {
      immediate: false,
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
      loading,
    }
  }

  const useDeleteUser = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(deleteUser, {
      immediate: false,
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
      loading,
    }
  }

  const useBatchDeleteUser = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(batchDeleteUser, {
      immediate: false,
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
      loading,
    }
  }

  const useUpdateUserPassword = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest((id: number, data: { password: string }) => updateUserPassword(id, data), {
      immediate: false,
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
      loading,
    }
  }

  return {
    useUserList,
    useUserDetail,
    useCreateUser,
    useUpdateUser,
    useDeleteUser,
    useBatchDeleteUser,
    useUpdateUserPassword,
  }
}
