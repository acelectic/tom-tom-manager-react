import { Redirect, Route, Switch } from 'react-router'
import { useApiHealth, useCurrUser } from '../services/auth/auth-query'
import { useEffect, useMemo, useState } from 'react'
import paths from '../constant/paths'
import loadable from '@loadable/component'
import { Spin } from 'antd'
import styled from '@emotion/styled'

const SpinLayout = styled.div`
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
`

const PageNotFound = loadable(() => import('../pages/404'))
const Page505 = loadable(() => import('../pages/505'))
const SignIn = loadable(() => import('../pages/Auth/SignIn'))
const ForgotPassword = loadable(() => import('../pages/Auth/ForgotPassword'))
const ProtectedRoute = loadable(() => import('./protected'))

export const Routes = () => {
  const [isShowHealthError, setIsShowHealthError] = useState(false)

  const { isLoading: isHealthLoading, error: healthError } = useApiHealth({
    suspense: true,
    useErrorBoundary: false,
  })
  const { data, isLoading: isCurrUserLoading } = useCurrUser()

  const isLoading = useMemo(() => {
    return isCurrUserLoading
  }, [isCurrUserLoading])

  const isAuthorized = useMemo(() => {
    return !!data
  }, [data])

  useEffect(() => {
    if (
      !isHealthLoading &&
      !isShowHealthError &&
      healthError?.statusCode === 505
    ) {
      setIsShowHealthError(true)
    }
  }, [healthError, isHealthLoading, isShowHealthError])

  return isLoading ? (
    <SpinLayout>
      <Spin />
    </SpinLayout>
  ) : (
    <Switch>
      <Route path={paths.forgotPassword()} component={ForgotPassword} />

      {isShowHealthError ? (
        <>
          <Route path={paths.clientVersionNotAllowed()} component={Page505} />
          <Redirect to={paths.clientVersionNotAllowed()} />
        </>
      ) : null}

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
