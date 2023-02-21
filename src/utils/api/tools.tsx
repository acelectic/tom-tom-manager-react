import { AxiosResponse, AxiosInstance, AxiosRequestConfig } from 'axios'
import qs from 'qs'

export enum ContentType {
  XFORM = 'application/x-www-form-urlencoded',
  JSON = 'application/json',
  FORMDATA = 'multipart/form-data',
}

const customClientWithData = (
  url: string,
  method: AxiosInstance['put'] | AxiosInstance['post'] | AxiosInstance['patch'],
  data: any,
  option?: AxiosRequestConfig & { contentType: ContentType },
) => {
  const { contentType = ContentType.JSON, ...restOption } = option || {}
  return method(url, data, {
    headers: {
      'Content-Type': contentType,
    },
    ...restOption,
  })
}

const customClient = (
  url: string,
  method: AxiosInstance['delete'] | AxiosInstance['get'],
  params: any,
  option?: AxiosRequestConfig & { contentType?: ContentType },
) => {
  const { contentType = ContentType.JSON, ...restOption } = option || {}
  return method(url, {
    params,
    headers: {
      'Content-Type': contentType,
    },
    ...restOption,
  })
}

export type ResponseData<T> = Promise<AxiosResponse<T>>

export const createMethod = (
  client: AxiosInstance,
  apiWraper: (method: Promise<AxiosResponse>) => Promise<any>,
) => ({
  get: <T extends unknown>(
    url: string,
    param?: any,
    option?: AxiosRequestConfig & { contentType: ContentType },
  ): ResponseData<T> => apiWraper(customClient(url, client.get, param, option)),
  put: <T extends unknown>(
    url: string,
    data?: any,
    option?: AxiosRequestConfig & { contentType: ContentType },
  ): ResponseData<T> =>
    apiWraper(customClientWithData(url, client.put, data, option)),
  post: <T extends unknown>(
    url: string,
    data?: any,
    option?: AxiosRequestConfig & { contentType: ContentType },
  ): ResponseData<T> =>
    apiWraper(customClientWithData(url, client.post, data, option)),
  patch: <T extends unknown>(
    url: string,
    data?: any,
    option?: AxiosRequestConfig & { contentType: ContentType },
  ): ResponseData<T> =>
    apiWraper(customClientWithData(url, client.patch, data, option)),
  delete: <T extends unknown>(
    url: string,
    param?: any,
    option?: AxiosRequestConfig & { contentType: ContentType },
  ): ResponseData<T> =>
    apiWraper(customClient(url, client.delete, param, option)),
  getFile: <T extends Blob>(
    url: string,
    param?: any,
    option?: AxiosRequestConfig & { contentType?: ContentType },
  ): ResponseData<T> =>
    apiWraper(
      customClient(url, client.get, param, { responseType: 'blob', ...option }),
    ),
})

export const customRequestData = (request: any) => {
  if (request.headers['Content-Type'] === ContentType.FORMDATA) {
    if (request.data) {
      const formData = new FormData()
      Object.entries(request.data).forEach(([key, value]: any[]) => {
        if (value instanceof Array) {
          value.forEach((val) => {
            formData.append(`${key}`, val)
          })
        } else {
          formData.append(key, value)
        }
      })
      request.data = formData
    }
  } else if (request.headers['Content-Type'] === ContentType.XFORM) {
    if (request.data) {
      request.data = qs.stringify(request.data)
    }
  } else if (request.headers['Content-Type'] === ContentType.JSON) {
  }
}

export const deepLoop = (data: any, func: (data: any) => any): any => {
  if (data instanceof File) {
    return func(data)
  }
  if (data instanceof Array) {
    return data.map((d) => deepLoop(d, func))
  }
  if (data instanceof Object) {
    const formatData: any = {}
    Object.keys(data).forEach((key) => {
      formatData[key] = deepLoop(data[key], func)
    })
    return formatData
  }
  return func(data)
}

export class ApiErrorResponse extends Error {
  constructor(
    message: string,
    private errorCode: string,
    private error: string,
    private statusCode: number,
  ) {
    super(message)
  }
}
