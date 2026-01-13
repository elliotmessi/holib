// 运行时配置
import { clearAuth, getToken, getUserInfo, isAuthenticated } from "@/utils/auth"
import { UserInfo } from "./services/account"
import { message } from "antd"
import { RunTimeLayoutConfig, useModel } from "@umijs/max"

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ user?: UserInfo, permissions?: string[]; token?: string }> {
  // 从本地存储获取 token
  const token = getToken()
  console.log('token:', token)
  
  if (token) {
    return {
      token,
    }
  } else {
    clearAuth()
  }

  return {
    user: undefined,
    token: "",
    permissions: [],
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

export const layout: RunTimeLayoutConfig = () => {
  return {
    logo: "https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg",
    menuDataRender: (menuData) => {
      console.log('menuData:', menuData)
      return menuData
    }
  }
}
