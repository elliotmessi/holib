import { login, LoginRequest } from "@/services/auth"
import { clearAuth, setRefreshToken, setToken } from "@/utils/auth"
import { useModel } from "@umijs/max"
import { useRequest } from "alova/client"
import { message } from "antd"

export default () => {
  const { initProfile } = useModel("user")

  const useLogin = (options?: { success: () => void; error: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    // 登录请求
    const { send, loading } = useRequest(login, {
      immediate: false,
    })
      .onSuccess(async ({ data }) => {
        try {
          // useRequest 直接返回 data 字段的值
          // 存储 token
          const { accessToken, refreshToken } = data
          setToken(accessToken)
          setRefreshToken(refreshToken)

          // 获取用户信息
          initProfile()

          message.success("登录成功")
          success()
        } catch (error) {
          message.error(`登录后处理失败: ${error instanceof Error ? error.message : "未知错误"}`)
          clearAuth()
        }
      })
      .onError(({ error: err }) => {
        message.error(`登录失败: ${err.message}`)
        error()
      })

    const submitLogin = (data: LoginRequest) => {
      send(data)
    }

    return {
      submitLogin,
      loading,
    }
  }
  return {
    useLogin,
  }
}
