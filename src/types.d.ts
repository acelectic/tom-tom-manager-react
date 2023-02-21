interface IApiErrorResponse {
  errorCode: string
  error: string
  statusCode: number
  message: string
}
interface IApiErrorResponseConstructor {
  new (
    message: string,
    error: string,
    statusCode: number,
    message: string,
  ): IApiErrorResponse
  (
    message: string,
    error: string,
    statusCode: number,
    message: string,
  ): IApiErrorResponse
  readonly prototype: IApiErrorResponse
}

type OmitReactQueryOptions<
  TQueryFnData = unknown,
  TError = ApiErrorResponse,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<
  UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  'queryKey' | 'queryFn' | 'initialData'
>
