import qs from 'querystring'

type ParamType = { [p: string]: any } | undefined
type Option<T extends ParamType, V extends ParamType> = {
  routeParam?: T
  queryParam?: V
}

export const generate = <
  T extends ParamType = undefined,
  V extends ParamType = undefined
>(
  url: string,
) => (option?: Option<T, V>) => {
  const { routeParam, queryParam } = option || {}
  let newQueryParam = ''
  if (queryParam) {
    newQueryParam = `?${qs.stringify(queryParam)}`
  }

  let newUrl = url
  if (routeParam) {
    const urls = url.split('/')
    newUrl = urls
      .map(u => {
        if (/:.+/.test(u)) {
          return routeParam[u.slice(1)]
        }
        return u
      })
      .join('/')
  }

  return `${newUrl}${newQueryParam}`
}

const notFound = generate('/404')
const signIn = generate('/signIn')
const dashboard = generate('/dashboard')
const users = generate('/users')
const userDetail = generate<{ userId: string }>('/users/:userId')
const resources = generate('/resources')
const transactions = generate('/transactions')
const transactionDetail = generate<{ transactionId: string }>(
  '/transactions/:transactionId',
)
const payments = generate('/payments')

const admin = generate('/admin')
const setting = generate('/setting')

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  notFound,
  signIn,
  dashboard,
  users,
  userDetail,
  resources,
  transactions,
  transactionDetail,
  payments,
  admin,
  setting,
}
