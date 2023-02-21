import { Redirect, Route, Switch } from 'react-router'
import { useApiHealth, useCurrUser } from '../services/auth/auth-query'
import { useEffect, useMemo, useState } from 'react'
import paths from '../constant/paths'
import loadable from '@loadable/component'
import { Alert, Col, Modal, Row, Table, Typography } from 'antd'
import { chain } from 'lodash'
import { appVersion } from '../utils/helper'
import { pascalize } from 'humps'

const PageNotFound = loadable(() => import('../pages/404'))
const Page505 = loadable(() => import('../pages/505'))
const SignIn = loadable(() => import('../pages/Auth/SignIn'))
const ForgotPassword = loadable(() => import('../pages/Auth/ForgotPassword'))
const ProtectedRoute = loadable(() => import('./protected'))

export const Routes = () => {
  const [isShowHealthError, setIsShowHealthError] = useState(false)
  const { isLoading: isHealthLoading, error: healthError } = useApiHealth()
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
      <Route path={paths.clientVersionNotAllowed()} component={Page505} />
      {isShowHealthError ? (
        <Redirect to={paths.clientVersionNotAllowed()} />
      ) : (
        <></>
      )}
      {!isAuthorized ? <Redirect to={paths.signIn()} /> : <ProtectedRoute />}

      <Redirect to={paths.notFound()} />
    </Switch>
  )
}
