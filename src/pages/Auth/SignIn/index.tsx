import { useSignIn } from '../../../services/auth/auth-query'
import { ISignInParams } from '../../../services/auth/auth-types'
import styled from '@emotion/styled'
import { Button, Col, Form, Input, Row, Typography } from 'antd'
import { appVersion } from '../../../utils/helper'
import { Link, useLocation } from 'react-router-dom'
import paths from '../../../constant/paths'
import { useMemo } from 'react'

const Layout = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`
const AppVersionLayout = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
`

const SignIn = () => {
  const location = useLocation<{ email: string }>()
  const { email } = location.state || {}
  const { mutateAsync: signIn } = useSignIn()

  const initialValues = useMemo((): Partial<ISignInParams> => {
    return {
      email,
    }
  }, [email])

  return (
    <Layout>
      <Form<ISignInParams>
        initialValues={initialValues}
        onFinish={signIn}
        layout="vertical"
      >
        <Col>
          <h1>Tom-Tom Manager</h1>

          <h2>Register Or SignIn</h2>
          <Form.Item
            id="email"
            label="Email"
            name="email"
            rules={[
              {
                type: 'email',
                required: true,
              },
            ]}
          >
            <Input maxLength={250} />
          </Form.Item>
          <Form.Item
            id="password"
            label="Password"
            name="password"
            rules={[
              {
                type: 'string',
                required: true,
              },
            ]}
          >
            <Input.Password type="password" maxLength={20} />
          </Form.Item>
          <Row gutter={[10, 10]} justify="center">
            <Col span={16}>
              <Button type="primary" htmlType="submit" block>
                Submit
              </Button>
            </Col>
            <Col span={16}>
              <Link to={paths.forgotPassword()}>
                <Button block>Forgot Password</Button>
              </Link>
            </Col>
          </Row>
        </Col>
      </Form>
      <AppVersionLayout>
        <Typography.Text>{`v${appVersion}`}</Typography.Text>
      </AppVersionLayout>
    </Layout>
  )
}

export default SignIn
