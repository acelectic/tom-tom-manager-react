import { useMutation } from 'react-query'
import { api } from '../../utils/api'
import {
  IAdminChangePasswordParams,
  IAdminChangePasswordResponse,
  IAdminResetPasswordParams,
  IAdminResetPasswordResponse,
} from './auth-types'

const ADMIN_URL = 'admin'
const ADMIN_RESET_PASSWORD_URL = `${ADMIN_URL}/reset-password`
const ADMIN_CHANGE_PASSWORD_URL = `${ADMIN_URL}/change-password`

export const useResetPassword = () => {
  return useMutation(async (params: IAdminResetPasswordParams) => {
    const { data } = await api.tomtom.post<IAdminResetPasswordResponse>(
      ADMIN_RESET_PASSWORD_URL,
      params,
    )
    return data
  })
}
export const useChangePassword = () => {
  return useMutation(async (params: IAdminChangePasswordParams) => {
    const { data } = await api.tomtom.post<IAdminChangePasswordResponse>(
      ADMIN_CHANGE_PASSWORD_URL,
      params,
    )
    return data
  })
}
