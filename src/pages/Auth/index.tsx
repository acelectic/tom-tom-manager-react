import { useSignIn } from '../../services/auth/auth-query'
import { SignInParams } from '../../services/auth/auth-types'
import { Form } from 'react-final-form'
import { InputField } from '../../components/fields'
import styled from '@emotion/styled'
import Space from '../../components/commons/Space'

const Layout = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`

const SignIn = () => {
  const { mutateAsync: signIn } = useSignIn()
  return (
    <Layout>
      <Form<SignInParams>
        initialValues={{
          email: 'test@gmail.com',
          password: '123456',
        }}
        onSubmit={async values => {
          try {
            await signIn(values)
          } catch (error) {
            return error
          }
        }}
      >
        {({ handleSubmit }) => {
          return (
            <form>
              <Space direction="column" justify="center" alignItem="center">
                <h1>Tom-Tom Manager</h1>
                <div
                  style={{
                    width: 'max-content',
                  }}
                >
                  <h2>Register Or SignIn</h2>
                  <label htmlFor="email">Email</label>
                  <InputField id="email" name="email" type="email" />
                  <label htmlFor="password">Password</label>
                  <InputField id="password" name="password" type="password" />
                  <button type="button" onClick={handleSubmit}>
                    Submit
                  </button>
                </div>
              </Space>
            </form>
          )
        }}
      </Form>
    </Layout>
  )
}

export default SignIn
