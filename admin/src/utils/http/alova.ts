import { createAlova } from 'alova'
import Axios from 'axios'
import { axiosRequestAdapter } from '@alova/adapter-axios'
import ReactHook from 'alova/react'
import { createServerTokenAuthentication } from 'alova/client'
import { stringify } from 'qs'
import { formatToken, getRefreshToken, getToken, setToken } from '@/utils/auth'
import { refreshToken } from '@/services/auth'
import { useNavigate } from '@umijs/max'

const AxiosInstance = Axios.create({
  paramsSerializer: (params) => stringify(params, { arrayFormat: 'repeat' }),
})

const { onAuthRequired, onResponseRefreshToken } = createServerTokenAuthentication<
  typeof ReactHook,
  typeof axiosRequestAdapter
>({
  visitorMeta: {
    isVisitor: true,
  },
  refreshTokenOnError: {
    // 当服务端token过期
    isExpired(response) {
      return response.status === 424
    },
    // 当token过期时触发，在此函数中触发刷新token
    async handler() {
      try {
        const token = getRefreshToken()
        const data = await refreshToken({ refreshToken: token })
        setToken(data.accessToken)
      } catch (error) {
        // token刷新失败
        throw error
      }
    },
  },
  login({ data }) {
    console.log('data.accessToken:', data.data.accessToken)
    setToken(data.data.accessToken)
  },
  assignToken: (method) => {
    const token = getToken()
    console.log('get token:', token)
    method.meta?.authRole !== 'refreshToken' &&
      (method.config.headers.Authorization = formatToken(token))
  },
})

const alovaInstance = createAlova({
  baseURL: '/api/v1',
  timeout: 50000,
  statesHook: ReactHook,
  requestAdapter: axiosRequestAdapter({
    axios: AxiosInstance,
  }),
  /** request 拦截器 */
  beforeRequest: onAuthRequired((method) => {
    const { config, data, meta } = method
    console.log('method:', config, data, meta)
  }),
  responded: onResponseRefreshToken({
    onSuccess: async (response, method) => {
      console.log('response:', response)
      if (method.meta?.blob) {
        return response.data
      }

      // 处理code
      if (![200, 201].includes(response.data.code)) {
        throw response.data
      }

      return response.data?.data ? response.data.data : response.data
    },
    onError: (error, method) => {
      // error.status 服务端返回的状态码
      console.log('error.status:', error.status)
      if (error.status === 401) {
        // 处理401错误，调用带token的接口则跳转到登录页
        method.meta?.authRole === null && useNavigate()('/login')
      }
      // error.status 服务端返回的状态码
      if ([403, 404, 500].includes(error.status)) {
        // 处理403, 404, 500错误，跳转到错误页
        // location.href = `/error/${error.status}`
      }

      throw error.response?.data || error
    },
  }),
})

export default alovaInstance
