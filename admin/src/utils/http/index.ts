import type { RequestBody } from 'alova'
import alovaInstance from './alova'

type AlovaMethodConfig<R> = Parameters<typeof alovaInstance.Request<R>>[0]

type Config<R> = Omit<AlovaMethodConfig<R>, 'method' | 'url'> & {
  meta?: {
    authRole?: 'refreshToken' | 'login' | null
  }
}

class SolutionHttp {
  public getInstance() {
    return alovaInstance
  }

  public request<R>(config: AlovaMethodConfig<R>) {
    return alovaInstance.Request<R>(config)
  }

  public post<R = any>(url: string, data?: RequestBody, config?: Config<R>) {
    return alovaInstance.Post<R>(url, data, config)
  }

  public get<R = any>(url: string, params?: Record<string, unknown> | string, config?: Config<R>) {
    return alovaInstance.Get<R>(url, { ...config, params })
  }

  public put<R = any>(url: string, data?: RequestBody, config?: Config<R>) {
    return alovaInstance.Put<R>(url, data, config)
  }

  public delete<R = any>(url: string, data?: RequestBody, config?: Config<R>) {
    return alovaInstance.Delete<R>(url, data, config)
  }

  public patch<R = any>(url: string, data?: RequestBody, config?: Config<R>) {
    return alovaInstance.Patch<R>(url, data, config)
  }
}

const http = new SolutionHttp()

export default http

export { alovaInstance }
