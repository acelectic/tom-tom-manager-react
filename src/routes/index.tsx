import { Redirect, Route, Switch } from 'react-router'
import PageNotFound from '../pages/404'
import { useApiHealth, useCurrUser } from '../services/auth/auth-query'
import { useMemo } from 'react'
import { ProtectedRoute } from './protected'
import paths from '../constant/paths'
import SignIn from '../pages/Auth'

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
