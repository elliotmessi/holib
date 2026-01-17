import { useRequest } from "alova/client"
import { message } from "antd"
import {
  getRoleList,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  batchDeleteRole,
  getRolePermissions,
  updateRolePermissions,
  RoleQueryParams,
  RoleCreateRequest,
  RoleUpdateRequest,
} from "@/services/role"
import usePaginatedList from "@/hooks/usePaginatedList"

export default () => {
  const useRoleList = (params?: RoleQueryParams) => usePaginatedList(getRoleList, { params })

  const useRoleDetail = (id?: number) => {
    const { data, loading, send } = useRequest(() => getRoleById(id || 0), {
      immediate: !!id,
    })

    return {
      roleDetail: data,
      loading,
      fetchDetail: send,
    }
  }

  const useRolePermissionList = (roleId?: number) => {
    const { data, loading, send } = useRequest(() => getRolePermissions(roleId || 0), {
      immediate: !!roleId,
    })

    return {
      permissionList: data?.permissions || [],
      loading,
      fetchPermissions: send,
    }
  }

  const useCreateRole = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(createRole, {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("角色创建成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`角色创建失败: ${err.message}`)
        error()
      })

    const submitCreate = (data: RoleCreateRequest) => {
      send(data)
    }

    return {
      submitCreate,
      loading,
    }
  }

  const useUpdateRole = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest((id: number, data: RoleUpdateRequest) => updateRole(id, data), {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("角色更新成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`角色更新失败: ${err.message}`)
        error()
      })

    const submitUpdate = (id: number, data: RoleUpdateRequest) => {
      send(id, data)
    }

    return {
      submitUpdate,
      loading,
    }
  }

  const useDeleteRole = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(deleteRole, {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("角色删除成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`角色删除失败: ${err.message}`)
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

  const useBatchDeleteRole = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest(batchDeleteRole, {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("角色批量删除成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`角色批量删除失败: ${err.message}`)
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

  const useUpdateRolePermissions = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    const { send, loading } = useRequest((id: number, permissions: string[]) => updateRolePermissions(id, { permissions }), {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("角色权限更新成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`角色权限更新失败: ${err.message}`)
        error()
      })

    const submitUpdatePermissions = (id: number, permissions: string[]) => {
      send(id, permissions)
    }

    return {
      submitUpdatePermissions,
      loading,
    }
  }

  return {
    useRoleList,
    useRoleDetail,
    useRolePermissionList,
    useCreateRole,
    useUpdateRole,
    useDeleteRole,
    useBatchDeleteRole,
    useUpdateRolePermissions,
  }
}
