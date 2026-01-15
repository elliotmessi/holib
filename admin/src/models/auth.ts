import { logout } from "@/services/account"
import { login, LoginRequest, register, RegisterRequest } from "@/services/auth"
import { clearAuth, setRefreshToken, setToken } from "@/utils/auth"
import { useModel } from "@umijs/max"
import { useRequest } from "alova/client"
import { message } from "antd"

export default () => {
  const { initProfile } = useModel("user")
  const { setInitialState, initialState } = useModel("@@initialState")

  const useLogin = (options?: { success?: () => void; error?: () => void }) => {
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

          // 更新 initialState 中的 token
          setInitialState({
            ...initialState,
            token: accessToken,
          })

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
  const useRegister = (options?: { success?: () => void; error?: () => void }) => {
    const { success = () => {}, error = () => {} } = options || {}
    // 注册请求
    const { send, loading } = useRequest(register, {
      immediate: false,
    })
      .onSuccess(() => {
        message.success("注册成功")
        success()
      })
      .onError(({ error: err }) => {
        message.error(`注册失败: ${err.message}`)
        error()
      })

    const submitRegister = (data: RegisterRequest) => {
      send(data)
    }

    return {
      submitRegister,
      loading,
    }
  }
  const useLogout = () => {
    const { send, loading } = useRequest(logout, {
      immediate: false,
    })
      .onSuccess(() => {
        clearAuth()
        // 更新 initialState，清除 token
        setInitialState({
          ...initialState,
          token: "",
          user: undefined,
          permissions: [],
        })
        initProfile()
        message.success("退出成功")
      })
      .onError(({ error: err }) => {
        message.error(`退出失败: ${err.message}`)
      })

    const submitLogout = () => {
      send()
    }

    return {
      submitLogout,
      loading,
    }
  }
  return {
    useLogin,
    useLogout,
    useRegister,
  }
}
