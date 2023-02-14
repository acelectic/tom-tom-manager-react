import { Redirect, Route, Switch } from 'react-router'
import { useApiHealth, useCurrUser } from '../services/auth/auth-query'
import { useMemo } from 'react'
import paths from '../constant/paths'
import loadable from '@loadable/component'

const PageNotFound = loadable(() => import('../pages/404'))
const SignIn = loadable(() => import('../pages/Auth/SignIn'))
const ForgotPassword = loadable(() => import('../pages/Auth/ForgotPassword'))
const ProtectedRoute = loadable(() => import('./protected'))

export const Routes = () => {
  useApiHealth()
  const { data, isLoading } = useCurrUser()
  const isAuthorized = useMemo(() => {
    return !!data
  }, [data])

  return isLoading ? (
    <>Loading...</>
  ) : (
    <Switch>
      <Route path={paths.forgotPassword()} component={ForgotPassword} />
      {!isAuthorized ? (
        <Route path={paths.signIn()} component={SignIn} />
      ) : (
        <Redirect from={paths.signIn()} to="/" />
      )}

      <Route path={paths.notFound()} component={PageNotFound} />

      {!isAuthorized ? <Redirect to={paths.signIn()} /> : <ProtectedRoute />}

      <Redirect to={paths.notFound()} />
    </Switch>
  )
}
