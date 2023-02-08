import axios, { AxiosError, AxiosResponse } from 'axios'
import dayjs from 'dayjs'
import humps from 'humps'
import { getToken } from '../../services/auth/auth-action'
import { customRequestData, deepLoop } from './tools'
import { appVersion, sleep } from '../helper'
import { appConfig } from '../../config'

const createClient = () => {
  const ax = axios.create({
    withCredentials: true,
  })
  ax.interceptors.request.use((request: any) => {
    const host = appConfig.REACT_APP_API_HOST

    request.url = `${host}/${request.url}`
    const token = getToken()
    request.headers.common['Authorization'] = `Bearer ${token}`
    request.headers.common['App-Version'] = appVersion

    if (request.params) {
      request.params = deepLoop(request.params, modifyRequestData)
    }
    if (request.data) {
      request.data = deepLoop(request.data, modifyRequestData)
      // request.data = humps.decamelizeKeys(request.data)
      customRequestData(request)
    }
    return request
  })
  ax.interceptors.response.use(
    (response: AxiosResponse<any>) => {
      if (response.headers['content-type'].includes('application/json')) {
        response.data = humps.camelizeKeys(response.data)
        // deepLoop(response.data, data => {
        //   return data
        // })
      }
      return response
    },
    (error: any) => Promise.reject(error),
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
