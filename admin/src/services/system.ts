import http from "@/utils/http"

// 字典类型
export type DictType = {
  id: string
  code: string
  name: string
  description: string
  status: number
  createdAt: string
  updatedAt: string
}

// 字典项
export type DictItem = {
  id: string
  typeCode: string
  code: string
  name: string
  value: string
  sort: number
  status: number
  createdAt: string
  updatedAt: string
}

// 在线用户
export type OnlineUser = {
  userId: string
  username: string
  name: string
  ip: string
  location: string
  browser: string
  os: string
  loginTime: string
}

// 登录日志
export type LoginLog = {
  id: string
  username: string
  ip: string
  location: string
  browser: string
  os: string
  status: number
  message: string
  loginTime: string
}

// 系统参数
export type SystemParam = {
  id: string
  code: string
  name: string
  value: string
  description: string
  status: number
  createdAt: string
  updatedAt: string
}

// 字典类型查询参数
export type DictTypeQueryParams = {
  code?: string
  name?: string
  status?: number
  page?: number
  pageSize?: number
}

// 字典项查询参数
export type DictItemQueryParams = {
  typeCode: string
  code?: string
  name?: string
  status?: number
  page?: number
  pageSize?: number
}

// 在线用户查询参数
export type OnlineUserQueryParams = {
  username?: string
  page?: number
  pageSize?: number
}

// 登录日志查询参数
export type LoginLogQueryParams = {
  username?: string
  ip?: string
  status?: number
  startTime?: string
  endTime?: string
  page?: number
  pageSize?: number
}

// 系统参数查询参数
export type SystemParamQueryParams = {
  code?: string
  name?: string
  status?: number
  page?: number
  pageSize?: number
}

// 字典类型创建请求
export type DictTypeCreateRequest = {
  code: string
  name: string
  description?: string
  status?: number
}

// 字典类型更新请求
export type DictTypeUpdateRequest = {
  name?: string
  description?: string
  status?: number
}

// 字典项创建请求
export type DictItemCreateRequest = {
  typeCode: string
  code: string
  name: string
  value: string
  sort?: number
  status?: number
}

// 字典项更新请求
export type DictItemUpdateRequest = {
  code?: string
  name?: string
  value?: string
  sort?: number
  status?: number
}

// 系统参数创建请求
export type SystemParamCreateRequest = {
  code: string
  name: string
  value: string
  description?: string
  status?: number
}

// 系统参数更新请求
export type SystemParamUpdateRequest = {
  name?: string
  value?: string
  description?: string
  status?: number
}

// 字典类型相关接口
export const getDictTypeList = (params: DictTypeQueryParams) => http.get<{ list: DictType[]; total: number }>("/system/dict-types", params)
export const getDictTypeById = (id: string) => http.get<DictType>(`/system/dict-types/${id}`)
export const createDictType = (data: DictTypeCreateRequest) => http.post<DictType>("/system/dict-types", data)
export const updateDictType = (id: string, data: DictTypeUpdateRequest) => http.put<DictType>(`/system/dict-types/${id}`, data)
export const deleteDictType = (id: string) => http.delete(`/system/dict-types/${id}`)
export const batchDeleteDictType = (ids: string[]) => http.delete("/system/dict-types", { data: { ids } })

// 字典项相关接口
export const getDictItemList = (params: DictItemQueryParams) => http.get<{ list: DictItem[]; total: number }>("/system/dict-items", params)
export const getDictItemByType = (typeCode: string) => http.get<DictItem[]>(`/system/dict-items/by-type/${typeCode}`)
export const getDictItemById = (id: string) => http.get<DictItem>(`/system/dict-items/${id}`)
export const createDictItem = (data: DictItemCreateRequest) => http.post<DictItem>("/system/dict-items", data)
export const updateDictItem = (id: string, data: DictItemUpdateRequest) => http.put<DictItem>(`/system/dict-items/${id}`, data)
export const deleteDictItem = (id: string) => http.delete(`/system/dict-items/${id}`)
export const batchDeleteDictItem = (ids: string[]) => http.delete("/system/dict-items", { data: { ids } })

// 在线用户相关接口
export const getOnlineUserList = (params: OnlineUserQueryParams) => http.get<{ list: OnlineUser[]; total: number }>("/system/monitor/online", params)
export const forceLogout = (userId: string) => http.delete(`/system/monitor/online/${userId}`)

// 登录日志相关接口
export const getLoginLogList = (params: LoginLogQueryParams) => http.get<{ list: LoginLog[]; total: number }>("/system/monitor/login-log", params)
export const deleteLoginLog = (id: string) => http.delete(`/system/monitor/login-log/${id}`)
export const batchDeleteLoginLog = (ids: string[]) => http.delete("/system/monitor/login-log", { data: { ids } })
export const clearLoginLog = () => http.delete("/system/monitor/login-log/clear")

// 系统参数相关接口
export const getSystemParamList = (params: SystemParamQueryParams) => http.get<{ list: SystemParam[]; total: number }>("/system/parameters", params)
export const getSystemParamById = (id: string) => http.get<SystemParam>(`/system/parameters/${id}`)
export const createSystemParam = (data: SystemParamCreateRequest) => http.post<SystemParam>("/system/parameters", data)
export const updateSystemParam = (id: string, data: SystemParamUpdateRequest) => http.put<SystemParam>(`/system/parameters/${id}`, data)
export const deleteSystemParam = (id: string) => http.delete(`/system/parameters/${id}`)
export const batchDeleteSystemParam = (ids: string[]) => http.delete("/system/parameters", { data: { ids } })
