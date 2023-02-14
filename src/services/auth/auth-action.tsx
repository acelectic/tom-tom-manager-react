import Cookies from 'js-cookie'

export const cookieKeys = {
  accessToken: 'AccessToken',
  refreshToken: 'RefreshToken',
  user: 'User',
} as const

export const getAccessToken = () => {
  return localStorage.getItem('ACCESS_TOKEN')
}

export const setAccessToken = (token: string) => {
  localStorage.setItem('ACCESS_TOKEN', token)
}

export const removeAccessToken = () => {
  localStorage.removeItem('ACCESS_TOKEN')
}

export const getRefreshToken = () => {
  return localStorage.getItem('REFRESH_TOKEN')
}

export const setRefreshToken = (token: string) => {
  localStorage.setItem('REFRESH_TOKEN', token)
}

export const removeRefreshToken = () => {
  localStorage.removeItem('REFRESH_TOKEN')
}

export const removeCookies = () => {
  Cookies.remove(cookieKeys.accessToken)
  Cookies.remove(cookieKeys.refreshToken)
  Cookies.remove(cookieKeys.user)
}
