import { useSignIn } from '../../services/auth/auth-query'
import { SignInParams } from '../../services/auth/auth-types'
import styled from '@emotion/styled'
import { appConfig } from '../../config'
import { Button, Col, Form, Input, Typography } from 'antd'
import { appVersion } from '../../utils/helper'

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
  const { mutateAsync: signIn } = useSignIn()
  return (
    <Layout>
      <Form<SignInParams>
        initialValues={
          appConfig.REACT_APP_NODE_ENV === 'development'
            ? {
                email: 'test@gmail.com',
                password: '123456',
              }
            : undefined
        }
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
          <Button htmlType="submit" block>
            Submit
          </Button>
        </Col>
      </Form>
      <AppVersionLayout>
        <Typography.Text>{`v${appVersion}`}</Typography.Text>
      </AppVersionLayout>
    </Layout>
  )
}

export default SignIn
