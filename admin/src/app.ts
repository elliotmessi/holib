// 运行时配置
import type { RequestConfig } from '@umijs/max'

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{
  name?: string
  userId?: string
  token?: string
  permissions?: string[]
  [key: string]: any
}> {
  // 从本地存储获取 token 和用户信息
  const token = localStorage.getItem('token') || ''
  const userInfoStr = localStorage.getItem('userInfo')

  if (token && userInfoStr) {
    try {
      const userInfo = JSON.parse(userInfoStr)
      return {
        name: userInfo.name,
        userId: userInfo.id,
        token,
        permissions: userInfo.permissions || [],
        ...userInfo, // 包含完整的用户信息
      }
    } catch (error) {
      console.error('解析用户信息失败:', error)
      // 清除无效的本地存储
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
    }
  }

  return {
    name: '',
    userId: '',
    token: '',
    permissions: [],
  }
}

// 配置 request 拦截器
export const request: RequestConfig = {
  // 配置 API 基础路径，开发环境使用 proxy，生产环境根据实际情况调整
  baseURL: '/api',
  timeout: 10000,

  // 请求拦截器
  requestInterceptors: [
    (url, options) => {
      // 从本地存储获取 token
      const token = localStorage.getItem('token')

      // 如果有 token，添加到请求头
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        }
      }

      return {
        url,
        options: {
          ...options,
        },
      }
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      // 处理响应数据
      const { data } = response
      // 类型断言，确保 data 是带有 code 和 message 属性的对象
      const resData = data as { code: number; message?: string }

      // 如果响应成功（code 为 200），直接返回数据
      if (resData.code === 200) {
        return response
      }

      // 如果响应失败，抛出错误
      const error = new Error(resData.message || '请求失败')
      throw error
    },
  ],
}

// 路由守卫
export const onRouteChange = ({
  location,
  routes,
  action,
}: {
  location: { pathname: string }
  routes: any[]
  action: string
}) => {
  const token = localStorage.getItem('token')
  const userInfo = localStorage.getItem('userInfo')

  // 白名单路由，不需要认证
  const whiteList = ['/login', '/register', '/404']
  const isWhiteList = whiteList.includes(location.pathname)

  // 如果没有 token 且不在白名单中，跳转到登录页
  if (!token || !userInfo) {
    if (!isWhiteList) {
      window.location.href = '/login'
    }
  }
}

export const layout = () => {
  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
    },
  }
}
