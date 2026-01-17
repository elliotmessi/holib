import { PaginationHookConfig, usePagination, UsePaginationExposure } from "alova/client"
import { PagerQuery } from "@/types/pagination"
import { AlovaGenerics, Method } from "alova"

function usePaginatedList<AG extends AlovaGenerics, Item extends unknown, Query extends PagerQuery>(
  handler: (params?: Query) => Method<AG>,
  options?: PaginationHookConfig<AG, Item[]>
): Omit<UsePaginationExposure<AG, Item[], any[]>, "data"> & { data: AG["Responded"]["items"] } {
  const { initialPage = 1, initialPageSize = 10, params = {} } = options || {}

  return usePagination((page, pageSize) => handler({ ...params, page, pageSize }), {
    page: initialPage,
    pageSize: initialPageSize,
    data: response => response?.items || [],
    total: response => response?.meta?.totalItems || 0,
    ...options,
  })
}

export default usePaginatedList
