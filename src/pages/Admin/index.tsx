import { Button } from '@material-ui/core'
import { capitalize } from 'lodash'
import { useCallback, useContext, useMemo } from 'react'
import Page from '../../components/commons/Page'
import Space from '../../components/commons/Space'
import { UpdateUserCtx } from '../../constant/contexts'
import { Role } from '../../services/auth/auth-types'
import { useChangeRole, useGetUsers } from '../../services/user/user-query'
import { numberWithCommas, withCtx } from '../../utils/helper'
import UpdateUserModal from './UpdateUserModal'
import { Table } from 'antd'
import { usePageRunner } from '../../utils/custom-hook'
import { ColumnType } from 'antd/es/table'
import { Link } from 'react-router-dom'
import paths from '../../constant/paths'

const Admin = () => {
  const { mutate: changeRole } = useChangeRole()
  const [, setState] = useContext(UpdateUserCtx)

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

  const renderButtonAction = useCallback(
    (userId: string, userRole: Role, role: Role) => {
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
      const { id: userId, name, role: userRole } = data
      const roles = [Role.VIEWER, Role.USER, Role.MANAGER, Role.ADMIN]
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
              setState({
                visible: true,
                userId,
                name,
                role: userRole,
              })
            }}
          >
            Edit
          </Button>
        </Space>
      )
    },
    [renderButtonAction, setState],
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
    </Page>
  )
}

export default withCtx(UpdateUserCtx)(Admin)
