import { useRequest } from "alova/client"
import { message } from "antd"

import { getMenus } from "@/services/account"

export default () => {
  const {
    data: menus,
    send,
    loading,
  } = useRequest(getMenus, {
    immediate: false,
  }).onError(({ error }) => {
    message.error(`获取菜单失败: ${error.message}`)
  })

  return {
    send,
    menus,
    loading,
  }
}
