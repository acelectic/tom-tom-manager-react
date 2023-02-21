import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import dayjs from 'dayjs'
import humps from 'humps'
import { ApiErrorResponse, customRequestData, deepLoop } from './tools'
import { appVersion, sleep } from '../helper'
import { appConfig } from '../../config'
import { REFRESH_TOKEN_URL } from '../../services/auth/auth-query'
import {
  removeAccessToken,
  removeCookies,
  removeRefreshToken,
  setAccessToken,
  setRefreshToken,
} from '../../services/auth/auth-action'
import createAuthRefreshInterceptor from 'axios-auth-refresh'
import { IRefreshTokenResponse } from '../../services/auth/auth-types'

const requestInterceptor = (request: AxiosRequestConfig) => {
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

// Function that will be called to refresh authorization
const refreshAuthLogic = async (failedRequest: AxiosError) => {
  try {
    const ax = axios.create({
      withCredentials: true,
      baseURL: appConfig.REACT_APP_API_HOST,
    })
    const response = await ax.post<IRefreshTokenResponse>(REFRESH_TOKEN_URL)
    const { accessToken, refreshToken } = response.data
    setAccessToken(accessToken)
    setRefreshToken(refreshToken)
    return response
  } catch (error) {
    removeAccessToken()
    removeRefreshToken()
    removeCookies()
    window.location.reload()
    return Promise.reject(error)
  }
}

const createClient = () => {
  const ax = axios.create({
    withCredentials: true,
    baseURL: appConfig.REACT_APP_API_HOST,
  })

  // const axRefreshToken = axios.create({
  //   withCredentials: true,
  //   baseURL: appConfig.REACT_APP_API_HOST,
  // })

  // axRefreshToken.interceptors.response.use(responseInterceptor)
  ax.interceptors.request.use(requestInterceptor)
  ax.interceptors.response.use(
    responseInterceptor,
    // errorInterceptor(axRefreshToken),
  )
  // Instantiate the interceptor
  createAuthRefreshInterceptor(ax, refreshAuthLogic, {
    pauseInstanceWhileRefreshing: true,
    retryInstance: axios.create({
      withCredentials: true,
      baseURL: appConfig.REACT_APP_API_HOST,
    }),
    statusCodes: [401],
  })
  return ax
}

const modifyRequestData = (data: any) => {
  if (dayjs.isDayjs(data)) {
    return data.format()
  }
  return data
}

export const tomtomClient = createClient()

interface ITomTomErrorResponse {
  error: string
  errorCode: string
  statusCode: number
}

export const tomtomApiWrapper = async (method: Promise<AxiosResponse>) => {
  return Promise.all([method, sleep(100)])
    .then(([res]) => res)
    .catch((e: AxiosError) => {
      const { response, message } = e
      const { data } = (response || {}) as { data: ITomTomErrorResponse }
      const { errorCode, error, statusCode } = data || {}
      return Promise.reject(
        new ApiErrorResponse(
          errorCode || error || message,
          errorCode,
          error,
          statusCode,
        ),
      )
    })
}
