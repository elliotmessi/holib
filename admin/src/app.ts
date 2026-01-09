// 运行时配置
import { clearAuth, getToken, getUserInfo, isAuthenticated } from "@/utils/auth"
import { Menu, UserInfo } from "./services/account"

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<Partial<UserInfo> & { permissions?: string[]; menus?: Menu[]; token?: string }> {
  // 从本地存储获取 token 和用户信息
  const token = getToken()
  const userInfo = getUserInfo()

  if (token && userInfo) {
    return {
      token,
      ...userInfo, // 包含完整的用户信息
    }
  } else {
    clearAuth()
  }

  return {
    name: "",
    id: "",
    token: "",
    permissions: [],
    menus: [],
  }
}

// 路由守卫
export const onRouteChange = ({ location, routes, action }: { location: { pathname: string }; routes: any[]; action: string }) => {
  // 白名单路由，不需要认证
  const whiteList = ["/login", "/register", "/404"]
  const isWhiteList = whiteList.includes(location.pathname)

  // 如果没有 token 且不在白名单中，跳转到登录页
  if (!isAuthenticated() && !isWhiteList) {
    window.location.href = "/login"
  }
}

export const layout = () => {
  return {
    logo: "https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg",
    menu: {
      locale: false,
    },
  }
}
