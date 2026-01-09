import { useRequest } from "alova/client"

import { getMenus } from "@/services/account"

export default () => {
  
  const { data: menus, send, loading } = useRequest(getMenus, {
    immediate: false,
  })

  return {
    send,
    menus,
    loading,
  }
}
