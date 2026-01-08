import { getCaptcha } from '@/services/auth'
import { useRequest } from '@umijs/max'
import { message } from 'antd'

export default () => {
  // 获取验证码
  const { run, data, loading } = useRequest(getCaptcha, {
    onError: (error) => {
      message.error(`获取验证码失败: ${error.message}`)
    },
  })
  return {
    run,
    loading,
    data,
  }
}
