import { Button } from '@material-ui/core'
import { capitalize } from 'lodash'
import { useCallback, useContext, useMemo } from 'react'
import Page from '../../components/commons/Page'
import Space from '../../components/commons/Space'
import { ChangePasswordCtx, UpdateUserCtx } from '../../constant/contexts'
import { EnumRole } from '../../services/auth/auth-types'
import { useChangeRole, useGetUsers } from '../../services/user/user-query'
import { numberWithCommas, withCtx } from '../../utils/helper'
import UpdateUserModal from './UpdateUserModal'
import { Modal, Table } from 'antd'
import { usePageRunner } from '../../utils/custom-hook'
import { ColumnType } from 'antd/es/table'
import { Link } from 'react-router-dom'
import paths from '../../constant/paths'
import { useResetPassword } from '../../services/admin/admin-query'
import Authorize from '../../components/commons/Authorize'
import ChangePasswordModal from './ChangePasswordModal'

const Admin = () => {
  const { mutate: changeRole } = useChangeRole()
  const [, setUpdateUserState] = useContext(UpdateUserCtx)
  const [, setChangePasswordState] = useContext(ChangePasswordCtx)

  const { page, pageSize, setNewPage, changePageSize } = usePageRunner({
    alias: {
      page: 'admin-users-page',
      perPage: 'admin-users-per-page',
    },
  })
  const { data: usersPagination, isLoading } = useGetUsers({
    page,
    limit: pageSize,
  })
  const { mutate: resetPassword } = useResetPassword()

  const renderButtonAction = useCallback(
    (userId: string, userRole: EnumRole, role: EnumRole) => {
      return (
        <Button
          key={`${userId}-${userRole}-${role}`}
          variant="contained"
          color={userRole === role ? 'secondary' : 'default'}
          style={{ fontWeight: 'bold' }}
          size="small"
          // disabled={role === Role.USER}
          onClick={() => {
            userRole !== role &&
              changeRole({
                userId,
                role,
              })
          }}
        >
          {capitalize(role)}
        </Button>
      )
    },
    [changeRole],
  )

  const renderActions = useCallback(
    (data: UsersType[number]) => {
      const { id: userId, name, email, role: userRole } = data
      const roles = [
        EnumRole.VIEWER,
        EnumRole.USER,
        EnumRole.MANAGER,
        EnumRole.ADMIN,
      ]
      return (
        <Space spacing={10}>
          <Space spacing={10}>
            {roles.map((role) => renderButtonAction(userId, userRole, role))}
          </Space>
          <Button
            variant="outlined"
            color={'primary'}
            style={{ fontWeight: 'bold' }}
            size="small"
            onClick={() => {
              setUpdateUserState({
                visible: true,
                userId,
                name,
                role: userRole,
              })
            }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color={'primary'}
            style={{ fontWeight: 'bold' }}
            size="small"
            onClick={() => {
              Modal.confirm({
                title: 'Confirm Reset Password',
                content: `reset password user: ${name} (${email})`,
                onOk: () => {
                  resetPassword({
                    email,
                  })
                },
              })
            }}
          >
            Reset Password
          </Button>
          <Authorize roles={[EnumRole.ADMIN]} allowLocalAdmin>
            <Button
              variant="outlined"
              color={'primary'}
              style={{ fontWeight: 'bold' }}
              size="small"
              onClick={() => {
                setChangePasswordState({
                  visible: true,
                  userId,
                  name,
                  email,
                })
              }}
            >
              Change Password
            </Button>
          </Authorize>
        </Space>
      )
    },
    [
      renderButtonAction,
      resetPassword,
      setChangePasswordState,
      setUpdateUserState,
    ],
  )

  type UsersType = typeof dataSource
  const dataSource = useMemo(
    () =>
      usersPagination
        ? usersPagination?.items.map((d) => ({
            ...d,
            balance: numberWithCommas(d.balance),
          }))
        : [],
    [usersPagination],
  )

  const columns = useMemo(() => {
    const tmpColumns: ColumnType<typeof dataSource[number]>[] = [
      {
        title: 'Name',
        dataIndex: 'name',
        render: (value, user) => {
          const { id: userId, name } = user
          return (
            <Link
              to={paths.userDetail({
                routeParam: {
                  userId,
                },
              })}
            >
              {name}
            </Link>
          )
        },
      },
      {
        title: 'Email',
        dataIndex: 'email',
      },
      {
        title: 'Balance',
        dataIndex: 'balance',
      },
      {
        render: (value, user) => {
          return renderActions(user)
        },
      },
    ]
    return tmpColumns
  }, [renderActions])

  return (
    <Page title="Admin">
      <Table
        rowKey="id"
        dataSource={dataSource}
        columns={columns}
        loading={isLoading}
        pagination={{
          size: 'small',
          current: page,
          pageSize,
          total: usersPagination?.meta.totalItems || 0,
          onChange: (page, pageSize) => {
            setNewPage(page)
            changePageSize(pageSize)
          },
        }}
      />
      <UpdateUserModal />
      <ChangePasswordModal />
    </Page>
  )
}

export default withCtx(UpdateUserCtx)(withCtx(ChangePasswordCtx)(Admin))
