// 全局共享数据
import { useState, useEffect } from "react"
import { clearAuth, getToken, getUserInfo } from "@/utils/auth"
import { UserInfo } from "@/services/account"

// 定义全局状态类型
interface GlobalState {
  // 用户信息
  userInfo: UserInfo & {
    permissions: string[]
  }
  // 加载状态
  loading: boolean
  // 错误信息
  error: string | null
}

const useGlobal = () => {
  // 初始化全局状态
  const [state, setState] = useState<GlobalState>({
    userInfo: {
      id: "",
      name: "",
      nickName: "",
      email: "",
      permissions: [],
    },
    loading: false,
    error: null,
  })

  // 从本地存储加载用户信息
  const loadUserInfo = () => {
    const token = getToken()
    const userInfo = getUserInfo()

    if (token && userInfo) {
      try {
        setState(prev => ({
          ...prev,
          userInfo,
        }))
      } catch (error) {
        // 清除无效的本地存储
        clearAuth()
      }
    }
  }

  // 初始化加载用户信息
  useEffect(() => {
    loadUserInfo()
  }, [])

  // 清除用户信息（登出）
  const clearUserInfo = () => {
    // 清除本地存储
    clearAuth()

    // 重置全局状态
    setState({
      userInfo: {
        id: "",
        name: "",
        nickName: "",
        email: "",
        permissions: [],
      },
      loading: false,
      error: null,
    })
  }

  // 设置加载状态
  const setLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, loading }))
  }

  return {
    ...state,
    clearUserInfo,
    setLoading,
  }
}

export default useGlobal
