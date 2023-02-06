import { useMutation, useQuery, useQueryClient } from 'react-query'
import { api } from '../../utils/api'
import { useSnackbar } from '../../utils/custom-hook'
import { USER_URL } from '../user/user-query'
import { getToken, removeToken, setToken } from './auth-action'
import { SignInParams, SignInResponse, UserEntity } from './auth-types'

export const HEALTH_URL = 'health'
export const AUTH = 'auth'
export const SIGN_IN = `${AUTH}/register`
export const SIGN_OUT = `${AUTH}/sign-out`

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
      const response = await api.tomtom.get<UserEntity>(CURRENT_USER)
      return response.data
    },
    {
      staleTime: 10 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      enabled: !!getToken(),
      onError: () => {
        removeToken()
      },
      retry: 0,
    },
  )
}

// export const useUser = (params: GetUserParams) => {
//   const { userId, relations: dupRelations = [] } = params
//   const relations = uniq(dupRelations)
//   return useQuery<CurrentUser | undefined>(
//     [USERS, { userId, relations }],
//     async () => {
//       const response = await api.blcpIdp.get<CurrentUser>(`${USERS}/${userId}`, { relations })
//       return response.data
//     },
//     {
//       retry: 0,
//       enabled: !!userId,
//     },
//   )
// }

export const useSignIn = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async (params: SignInParams) => {
      const { data } = await api.tomtom.post<SignInResponse>(SIGN_IN, params)
      return data
    },
    {
      onSuccess: data => {
        const { accessToken, user } = data
        setToken(accessToken)
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
      return api.tomtom.post(SIGN_OUT)
    },
    {
      onSuccess: () => {
        removeToken()
        queryClient.resetQueries([USER_URL, CURRENT_USER])
        queryClient.removeQueries()
      },
    },
  )
}
