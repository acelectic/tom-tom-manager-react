import { useCreateUser } from '../../services/user/user-query'
import Page from '../../components/commons/Page'
import { Role, SignInParams } from '../../services/auth/auth-types'
import Authorize from '../../components/commons/Authorize'
import AddButton from '../../components/AddButton'
import TableUsers from '../../components/TableUsers'

const Users = () => {
  const { mutate: createUser } = useCreateUser()
  return (
    <Page title={'User Management'}>
      <Authorize roles={[Role.ADMIN]}>
        <AddButton<SignInParams>
          fieldNames={['name', 'email', 'password']}
          name={'Add User'}
          onSubmit={async (v) => {
            const { email, password, name } = v
            createUser({
              email,
              password,
              name,
            })
          }}
        />
      </Authorize>
      <TableUsers />
    </Page>
  )
}
export default Users
