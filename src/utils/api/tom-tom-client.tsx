import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios'
import dayjs from 'dayjs'
import humps from 'humps'
import { customRequestData, deepLoop } from './tools'
import { appVersion, sleep } from '../helper'
import { appConfig } from '../../config'
import {
  REFRESH_TOKEN_URL,
  SIGN_IN_URL,
  apiRefreshToken,
} from '../../services/auth/auth-query'
import { getRefreshToken } from '../../services/auth/auth-action'

interface IAxiosRequestConfig extends AxiosRequestConfig {
  _retry: boolean
}

const requestInterceptor = (request: any) => {
  const host = appConfig.REACT_APP_API_HOST

  request.url = `${host}/${request.url}`
  request.headers.common['App-Version'] = appVersion

  if (request.params) {
    request.params = deepLoop(request.params, modifyRequestData)
  }
  if (request.data) {
    request.data = deepLoop(request.data, modifyRequestData)
    customRequestData(request)
  }
  return request
}

const responseInterceptor = (response: AxiosResponse<any>) => {
  if (response.headers['content-type'].includes('application/json')) {
    response.data = humps.camelizeKeys(response.data)
    // deepLoop(response.data, data => {
    //   return data
    // })
  }
  return response
}

const errorInterceptor =
  (axRefreshToken: AxiosInstance) => async (error: AxiosError) => {
    const originalConfig = error.config as IAxiosRequestConfig
    const refreshToken = getRefreshToken()
    if (
      ![SIGN_IN_URL, REFRESH_TOKEN_URL].includes(originalConfig.url || '') &&
      error.response
    ) {
      // Access Token was expired
      if (
        error.response.status === 401 &&
        !originalConfig._retry &&
        !!refreshToken
      ) {
        originalConfig._retry = true
        try {
          await apiRefreshToken()
          return axRefreshToken(originalConfig)
        } catch (_error) {
          return Promise.reject(_error)
        }
      }
    }

    return Promise.reject(error)
  }

const createClient = () => {
  const ax = axios.create({
    withCredentials: true,
  })

  const axRefreshToken = axios.create({
    withCredentials: true,
  })

  axRefreshToken.interceptors.response.use(responseInterceptor)
  ax.interceptors.request.use(requestInterceptor)
  ax.interceptors.response.use(
    responseInterceptor,
    errorInterceptor(axRefreshToken),
  )
  return ax
}

const modifyRequestData = (data: any) => {
  if (dayjs.isDayjs(data)) {
    return data.format()
  }
  return data
}

export const tomtomClient = createClient()

export const tomtomApiWrapper = async (method: Promise<AxiosResponse>) => {
  return Promise.all([method, sleep(100)])
    .then(([res]) => res)
    .catch((e: AxiosError) => {
      const { response, message } = e
      const { data } = response || {}
      const { message: errorMessage } = data || {}
      return Promise.reject(errorMessage || message || e)
    })
}
