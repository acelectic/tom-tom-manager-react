import { Redirect, Route, Switch } from 'react-router'
import { useApiHealth, useCurrUser } from '../services/auth/auth-query'
import { useEffect, useMemo, useState } from 'react'
import paths from '../constant/paths'
import loadable from '@loadable/component'
import { Alert, Col, Modal, Row, Table, Typography } from 'antd'
import { chain } from 'lodash'

const PageNotFound = loadable(() => import('../pages/404'))
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
      Modal.error({
        title: 'Server Connection Reject',
        closable: false,
        width: 500,
        okButtonProps: {
          style: {
            display: 'none',
          },
        },
        content: (
          <Row gutter={[6, 6]}>
            <Col span={24}>
              <Table
                dataSource={chain(healthError)
                  .entries()
                  .transform(
                    (acc: { key: string; value: string | number }[], cur) => {
                      const [key, value] = cur
                      acc.push({
                        key,
                        value,
                      })
                      return acc
                    },
                    [],
                  )
                  .value()}
                columns={[
                  {
                    dataIndex: 'key',
                    width: 'max-content',
                  },
                  {
                    dataIndex: 'value',
                    width: '100%',
                    render(value) {
                      return (
                        <Typography.Paragraph
                          style={{
                            marginBottom: 0,
                          }}
                        >
                          {value}
                        </Typography.Paragraph>
                      )
                    },
                  },
                ]}
                bordered={false}
                pagination={false}
                indentSize={6}
                size="small"
              />
            </Col>
            <Col span={24}>
              <Alert
                type="warning"
                message=" Please refresh page and try again"
                banner
                showIcon
              />
            </Col>
          </Row>
        ),
      })
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

      {!isAuthorized ? <Redirect to={paths.signIn()} /> : <ProtectedRoute />}

      <Redirect to={paths.notFound()} />
    </Switch>
  )
}
