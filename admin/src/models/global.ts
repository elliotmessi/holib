// 全局共享数据
import { useState, useEffect } from 'react'
import { getProfile, getPermissions } from '@/services/account'

// 定义全局状态类型
interface GlobalState {
  // 用户信息
  userInfo: {
    id?: string
    name?: string
    nickName?: string
    email?: string
    permissions?: string[]
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
      id: '',
      name: '',
      nickName: '',
      email: '',
      permissions: [],
    },
    loading: false,
    error: null,
  })

  // 从本地存储加载用户信息
  const loadUserInfo = () => {
    const token = localStorage.getItem('token')
    const userInfoStr = localStorage.getItem('userInfo')

    if (token && userInfoStr) {
      try {
        const userInfo = JSON.parse(userInfoStr)
        setState((prev) => ({
          ...prev,
          userInfo,
        }))
      } catch (error) {
        console.error('解析用户信息失败:', error)
        // 清除无效的本地存储
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
      }
    }
  }

  // 初始化加载用户信息
  useEffect(() => {
    loadUserInfo()
  }, [])

  // 更新用户信息
  const updateUserInfo = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      // 获取用户信息
      const profileRes = await getProfile()
      if (profileRes.success) {
        // 获取权限列表
        const permissionsRes = await getPermissions()
        if (permissionsRes.success) {
          const userInfo = {
            ...profileRes.data,
            permissions: permissionsRes.data,
          }

          // 更新全局状态
          setState((prev) => ({
            ...prev,
            userInfo,
            loading: false,
          }))

          // 存储到本地
          localStorage.setItem('userInfo', JSON.stringify(userInfo))
        } else {
          setState((prev) => ({
            ...prev,
            error: `获取权限列表失败: ${permissionsRes.errorMessage}`,
            loading: false,
          }))
        }
      } else {
        setState((prev) => ({
          ...prev,
          error: `获取用户信息失败: ${profileRes.errorMessage}`,
          loading: false,
        }))
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: `更新用户信息失败: ${error instanceof Error ? error.message : '未知错误'}`,
        loading: false,
      }))
    }
  }

  // 清除用户信息（登出）
  const clearUserInfo = () => {
    // 清除本地存储
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')

    // 重置全局状态
    setState({
      userInfo: {
        id: '',
        name: '',
        nickName: '',
        email: '',
        permissions: [],
      },
      loading: false,
      error: null,
    })
  }

  // 设置加载状态
  const setLoading = (loading: boolean) => {
    setState((prev) => ({ ...prev, loading }))
  }

  return {
    ...state,
    updateUserInfo,
    clearUserInfo,
    setLoading,
  }
}

export default useGlobal
