import { useMutation, useQuery, useQueryClient } from 'react-query'
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
  IRefreshTokenResponse,
  ISignInParams,
  ISignInResponse,
  IUserEntity,
} from './auth-types'

export const HEALTH_URL = 'health'
export const AUTH_URL = 'auth'
export const SIGN_IN_URL = `${AUTH_URL}/register`
export const SIGN_OUT_URL = `${AUTH_URL}/sign-out`
export const REFRESH_TOKEN_URL = `${AUTH_URL}/refresh-token`

export const CURRENT_USER = `${USER_URL}/current-user`

export const useApiHealth = () => {
  const { snackbar } = useSnackbar()
  return useQuery([HEALTH_URL], () => api.tomtom.get(HEALTH_URL), {
    onSuccess: () => {
      console.log(' Server is running '.padStart(10, '-').padEnd(10, '-'))
    },
    onError: () => {
      snackbar({
        message: 'Server Connection fail',
      })
    },
    retry: 2,
    cacheTime: 10 * 60 * 1000,
    staleTime: 10 * 60 * 1000,
  })
}

export const useCurrUser = () => {
  return useQuery(
    [USER_URL, CURRENT_USER],
    async () => {
      const response = await api.tomtom.get<IUserEntity>(CURRENT_USER)
      return response.data
    },
    {
      staleTime: 10 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      enabled: !!getAccessToken(),
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

export const apiRefreshToken = async () => {
  const { data } = await api.tomtom.post<IRefreshTokenResponse>(
    REFRESH_TOKEN_URL,
  )
  const { accessToken, refreshToken } = data
  setAccessToken(accessToken)
  setRefreshToken(refreshToken)
  return data
}

export const useRefreshToken = () => {
  return useMutation(apiRefreshToken)
}
