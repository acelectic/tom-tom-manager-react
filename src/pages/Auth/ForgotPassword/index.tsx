import { useForgotPassword } from '../../../services/auth/auth-query'
import { IForgotPasswordParams } from '../../../services/auth/auth-types'
import styled from '@emotion/styled'
import { Button, Col, Form, Input, Modal, Typography } from 'antd'
import { appVersion } from '../../../utils/helper'
import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import paths from '../../../constant/paths'

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

const ForgotPassword = () => {
  const history = useHistory<{ email: string }>()
  const { mutateAsync: forgotPassword } = useForgotPassword()
  const onSubmit = useCallback(
    async (values: IForgotPasswordParams) => {
      await forgotPassword(values).then((response) => {
        Modal.info({
          title: 'New Password',
          content: response.newPassword,
          onOk: () => {
            history.replace(paths.signIn(), {
              email: values.email,
            })
          },
        })
      })
    },
    [forgotPassword, history],
  )
  return (
    <Layout>
      <Form<IForgotPasswordParams> onFinish={onSubmit} layout="vertical">
        <Col>
          <h1>Tom-Tom Manager</h1>
          <h2>Forgot Password</h2>
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
          <Button type="primary" htmlType="submit" block>
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

export default ForgotPassword
