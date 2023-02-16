export {}
declare global {
  interface AnyObject {
    [name: string]: any
    [name: number]: any
  }
  interface BaseUserInf extends AnyObject {
    id: number
    name: string
  }
  type BaseUsersInf = BaseUserInf[]

  interface BaseResourceInf extends AnyObject {
    id: number
    name: string
    price: number
  }
  type BaseResourcesInf = BaseUserInf[]

  type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
  }

  interface BaseOptions {
    value: any
    label: string
    disabled?: boolean
  }

  interface IPaginationMeta {
    /**
     * the amount of items on this specific page
     */
    itemCount: number
    /**
     * the total amount of items
     */
    totalItems: number
    /**
     * the amount of items that were requested per page
     */
    itemsPerPage: number
    /**
     * the total amount of pages in this paginator
     */
    totalPages: number
    /**
     * the current page this paginator "points" to
     */
    currentPage: number
  }

  interface PaginationParams {
    page?: number
    limit?: number
  }
  interface Pagination<PaginationObject> {
    items: PaginationObject[]
    meta: IPaginationMeta
  }
}
