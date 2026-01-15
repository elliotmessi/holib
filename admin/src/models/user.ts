import { getPermissions, getProfile } from "@/services/account"
import { getToken, setUserInfo } from "@/utils/auth"
import { useRequest } from "alova/client"
import { message } from "antd"
import { useEffect, useState } from "react"
import { useModel } from "@umijs/max"

export default () => {
  const [loading, setLoading] = useState(false)
  // 获取用户信息
  const {
    send: getProfileRequest,
    data: userInfo,
    loading: uLoading,
  } = useRequest(getProfile, {
    immediate: false,
  }).onError(({ error }) => {
    message.error(`获取用户信息失败: ${error.message}`)
  })

  const {
    send: getPermissionsRequest,
    data: permissions,
    loading: permissionsLoading,
  } = useRequest(getPermissions, {
    immediate: false,
  }).onError(({ error }) => {
    message.error(`获取权限列表失败: ${error.message}`)
  })

  // 获取 initialState 和更新方法
  const { setInitialState } = useModel("@@initialState")

  const initProfile = async () => {
    Promise.all([getProfileRequest(), getPermissionsRequest()])
  }

  useEffect(() => {
    const token = getToken()
    if (token) {
      initProfile()
    }
  }, [])

  useEffect(() => {
    if (userInfo && permissions) {
      const updatedUserInfo = { user: userInfo, permissions }
      setUserInfo(updatedUserInfo)
      // 更新 initialState
      setInitialState(initialState => ({
        ...initialState,
        ...updatedUserInfo,
      }))
    }
  }, [userInfo, permissions, setInitialState])

  useEffect(() => {
    setLoading(uLoading || permissionsLoading)
  }, [uLoading, permissionsLoading])

  return {
    getProfileRequest,
    userInfo,
    loading,
    initProfile,
  }
}
