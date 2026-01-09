import { getCaptcha } from "@/services/auth"
import { useRequest } from "alova/client"
import { message } from "antd"

export default () => {
  // 获取验证码
  const { send, data, loading } = useRequest(getCaptcha).onError(({ error }) => {
    message.error(`获取验证码失败: ${error.message}`)
  })
  return { send, loading, data }
}
