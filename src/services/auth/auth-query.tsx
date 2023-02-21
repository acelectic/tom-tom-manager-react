import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../utils/api'
import { useSnackbar } from '../../utils/custom-hook'
import { USER_URL } from '../user/user-query'
import {
  getAccessToken,
  removeAccessToken,
  setRefreshToken,
  setAccessToken,
  removeRefreshToken,
} from './auth-action'
import {
  IForgotPasswordParams,
  IForgotPasswordResponse,
  IGetCurrentUserBalanceResponse,
  ISignInParams,
  ISignInResponse,
  IUserEntity,
} from './auth-types'

export const HEALTH_URL = 'health'
export const AUTH_URL = 'auth'
export const SIGN_IN_URL = `${AUTH_URL}/register`
export const SIGN_OUT_URL = `${AUTH_URL}/sign-out`
export const REFRESH_TOKEN_URL = `${AUTH_URL}/refresh-token`
export const FORGOT_PASSWORD_URL = `${AUTH_URL}/forgot-password`
export const CURRENT_USER = `${USER_URL}/current-user`
export const CURRENT_USER_BALANCE = `${CURRENT_USER}/balance`

export const useApiHealth = (options?: OmitReactQueryOptions<boolean>) => {
  const { snackbar } = useSnackbar()
  return useQuery<boolean, IApiErrorResponse>(
    [HEALTH_URL],
    async () => {
      const { data } = await api.tomtom.get<boolean>(HEALTH_URL)
      return data
    },
    {
      onSuccess: () => {
        console.log(' Server is running '.padStart(10, '-').padEnd(10, '-'))
      },
      onError: (error) => {
        console.log({ error })
        if (error.statusCode === 505) {
          // snackbar({
          //   message: error.message,
          // })
        } else {
          snackbar({
            message: 'Server Connection fail',
          })
        }
      },
      retry: 0,
      cacheTime: 10 * 60 * 1000,
      staleTime: 10 * 60 * 1000,
      ...options,
    },
  )
}

export const useCurrUser = () => {
  return useQuery(
    [USER_URL, CURRENT_USER],
    async () => {
      if (!getAccessToken()) return
      const response = await api.tomtom.get<IUserEntity>(CURRENT_USER)
      return response.data
    },
    {
      staleTime: 10 * 60 * 1000,
      cacheTime: 60 * 1000,
      onError: () => {
        removeAccessToken()
        removeRefreshToken()
      },
      retry: 0,
    },
  )
}

export const useSignIn = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async (params: ISignInParams) => {
      const { data } = await api.tomtom.post<ISignInResponse>(
        SIGN_IN_URL,
        params,
      )
      return data
    },
    {
      onSuccess: (data) => {
        const { accessToken, refreshToken, user } = data
        setAccessToken(accessToken)
        setRefreshToken(refreshToken)
        queryClient.setQueryData([USER_URL, CURRENT_USER], user)
      },
    },
  )
}

export const useCurrUserBalance = () => {
  return useQuery(
    [USER_URL, CURRENT_USER, CURRENT_USER_BALANCE],
    async () => {
      const response = await api.tomtom.get<IGetCurrentUserBalanceResponse>(
        CURRENT_USER,
      )
      return response.data.balance
    },
    {
      staleTime: Infinity,
      cacheTime: 5 * 1000,
      placeholderData: 0,
      enabled: !!getAccessToken(),
      retry: 0,
    },
  )
}

// export const useLoginForTest = () => {
//   const queryClient = useQueryClient()
//   return useMutation(
//     async (params: SigninParams) => {
//       const { data } = await api.blcpIdp.post<SigninResponse>(`${SIGN_IN}/email`, params)
//       return data
//     },
//     {
//       onSuccess: (data) => {
//         const { accessToken, user } = data
//         setToken(accessToken)
//         queryClient.setQueryData([CURRENT_USER], user)
//       },
//     },
//   )
// }

export const useSignOut = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async () => {
      return api.tomtom.post(SIGN_OUT_URL)
    },
    {
      onSuccess: () => {
        removeAccessToken()
        removeRefreshToken()
        queryClient.resetQueries([USER_URL, CURRENT_USER])
        queryClient.removeQueries()
      },
    },
  )
}

export const useForgotPassword = () => {
  return useMutation(async (params: IForgotPasswordParams) => {
    const { data } = await api.tomtom.post<IForgotPasswordResponse>(
      FORGOT_PASSWORD_URL,
      params,
    )
    return data
  })
}
