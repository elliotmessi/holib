import { login, LoginRequest } from "@/services/auth"
import { clearAuth } from "@/utils/auth"
import { useModel } from "@umijs/max"
import { useRequest } from "alova/client"
import { message } from "antd"

export default () => {
  const { initProfile } = useModel("user")
  let success = () => {}
  let error = () => {}
  // 登录请求
  const { send, onSuccess, onError, loading } = useRequest(login, {
    manual: true,
  })
  onSuccess(async ({ data: loginData }) => {
    try {
      // useRequest 直接返回 data 字段的值
      // 存储 token
      const token = loginData.token
      localStorage.setItem("token", token)

      // 获取用户信息
      await initProfile()

      message.success("登录成功")
      success()
    } catch (error) {
      message.error(`登录后处理失败: ${error instanceof Error ? error.message : "未知错误"}`)
      clearAuth()
    }
  })

  onError(({ error: err }) => {
    message.error(`登录失败: ${err.message}`)
    error()
  })

  const submitLogin = (data: LoginRequest, successCallback?: () => void, errorCallback?: () => void) => {
    if (successCallback) {
      success = successCallback
    }
    if (errorCallback) {
      error = errorCallback
    }
    send(data)
  }

  return {
    submitLogin,
    loading,
  }
}
