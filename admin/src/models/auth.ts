import { getCaptcha, login } from '@/services/auth'
import { useRequest, useModel } from '@umijs/max'
import { message } from 'antd'

export default () => {
  const { initProfile } = useModel('user')

  // 登录请求
  const { run: submitLogin, loading } = useRequest(login, {
    manual: true,
    onSuccess: async (loginData) => {
      try {
        // useRequest 直接返回 data 字段的值
        // 存储 token
        const token = loginData.token
        localStorage.setItem('token', token)

        // 获取用户信息
        await initProfile()

        message.success('登录成功')
      } catch (error) {
        message.error(`登录后处理失败: ${error instanceof Error ? error.message : '未知错误'}`)
        // 清除已存储的 token
        localStorage.removeItem('token')
      }
    },
    onError: (error) => {
      message.error(`登录失败: ${error.message}`)
    },
  })

  return {
    submitLogin,
    loading,
  }
}
