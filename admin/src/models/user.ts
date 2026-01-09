import { getPermissions, getProfile } from "@/services/account"
import { setUserInfo } from "@/utils/auth"
import { useRequest } from "alova/client"
import { message } from "antd"
import { useEffect } from "react"

export default () => {
  // 获取用户信息
  const {
    send: getProfileRequest,
    data: userInfo,
    loading,
  } = useRequest(getProfile, {
    immediate: false,
  }).onError(({ error }) => {
    message.error(`获取用户信息失败: ${error.message}`)
  })

  const { send: getPermissionsRequest, data: permissions } = useRequest(getPermissions, {
    immediate: false,
  }).onError(({ error }) => {
    message.error(`获取权限列表失败: ${error.message}`)
  })

  const initProfile = () => {
    Promise.all([getProfileRequest(), getPermissionsRequest()])
  }

  useEffect(() => {
    console.log('userInfo && permissions:', userInfo, permissions)
    if (userInfo && permissions) {
      setUserInfo({ ...userInfo, permissions })
    }
  }, [userInfo, permissions])

  return {
    getProfileRequest,
    userInfo,
    loading,
    initProfile,
  }
}
