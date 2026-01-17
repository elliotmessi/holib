export interface PaginationMeta {
  itemCount: number
  totalItems?: number
  itemsPerPage: number
  totalPages?: number
  currentPage: number
}

export interface PaginatedResponse<T> {
  items: T[]
  meta: PaginationMeta
}

export type PagerQuery<T extends Record<string, any> = Record<string, any>> = T & {
  page?: number
  pageSize?: number
}
