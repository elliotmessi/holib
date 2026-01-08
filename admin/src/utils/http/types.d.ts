import type { Method, AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios'

export type resultType = {
  accessToken?: string
}

export type RequestMethods = Extract<
  Method,
  'get' | 'post' | 'put' | 'delete' | 'patch' | 'option' | 'head'
>

export interface SolutionHttpError extends AxiosError {
  isCancelRequest?: boolean
}

export interface SolutionHttpResponse extends AxiosResponse {
  config: SolutionHttpRequestConfig
}

export interface SolutionHttpRequestConfig extends AxiosRequestConfig {
  beforeRequestCallback?: (request: SolutionHttpRequestConfig) => void
  beforeResponseCallback?: (response: SolutionHttpResponse) => void
}
