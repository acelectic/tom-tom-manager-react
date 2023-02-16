import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import paths from '../constant/paths'
import { numberWithCommas } from '../utils/helper'
import { useGetUsers } from '../services/user/user-query'
import Page from './commons/Page'
import { usePageRunner, useSnackbar } from '../utils/custom-hook'
import { useConfirmUserAllPayments } from '../services/payment/payment-query'
import Authorize from './commons/Authorize'
import { sumBy } from 'lodash'
import { EnumRole } from '../services/auth/auth-types'
import { Button, Col, Modal, Table, Typography } from 'antd'
import { ColumnType } from 'antd/es/table'
import { PaymentStatus } from '../services/payment/payment-types'

interface TableUsersProps {
  transactionId?: string
}
const TableUsers = (props: TableUsersProps) => {
  const { transactionId } = props
  const { snackbar } = useSnackbar()
  const { mutate: confirmUserAllPayments } = useConfirmUserAllPayments()
  const { page, pageSize, setNewPage, changePageSize } = usePageRunner({
    alias: {
      page: 'users-page',
      perPage: 'users-per-page',
    },
  })
  const { data: usersPagination, isLoading } = useGetUsers({
    transactionId,
    page,
    limit: pageSize,
  })
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
          const sumPrice = sumBy(user.payments, ({ status, price }) =>
            status === PaymentStatus.PENDING ? price : 0,
          )
          return (
            <Authorize roles={[EnumRole.ADMIN]} allowLocalAdmin>
              <Button
                danger
                type="primary"
                size="small"
                disabled={!sumPrice}
                onClick={() => {
                  Modal.confirm({
                    title: 'Confirm All Payment',
                    centered: true,
                    content: (
                      <Col>
                        <Col>
                          <Typography.Text>
                            {`Confirm All Payment for : `}
                            <Typography.Text mark strong>
                              {`${user.name}`}
                            </Typography.Text>
                          </Typography.Text>
                        </Col>
                        <Col>
                          <Typography.Text strong>
                            {`Amount: ${numberWithCommas(sumPrice)}`}
                          </Typography.Text>
                        </Col>
                      </Col>
                    ),
                    onOk: () => {
                      confirmUserAllPayments(
                        {
                          userId: user.id,
                        },
                        {
                          onSuccess: () => {
                            snackbar({
                              type: 'success',
                              message: `Confirm All Payment: ${
                                user.name
                              }, Amount: ${numberWithCommas(sumPrice)}`,
                            })
                          },
                        },
                      )
                    },
                  })
                }}
              >
                Confirm All Payments
              </Button>
            </Authorize>
          )
        },
      },
    ]
    return tmpColumns
  }, [confirmUserAllPayments, snackbar])

  return (
    <Page title={'Users'}>
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
    </Page>
  )
}
export default TableUsers
