import dayjs from 'dayjs'
import { useCallback, useMemo } from 'react'
import { EnumRole } from '../services/auth/auth-types'
import {
  useConfirmPayment,
  useGetPayments,
} from '../services/payment/payment-query'
import { PaymentStatus } from '../services/payment/payment-types'
import { usePageRunner, useSnackbar } from '../utils/custom-hook'
import { numberWithCommas } from '../utils/helper'
import { Button, Col, Modal, Table, Tag, Typography } from 'antd'
import Authorize from './commons/Authorize'
import Page from './commons/Page'
import { ColumnType } from 'antd/es/table'
import { Link } from 'react-router-dom'
import paths from '../constant/paths'

interface TablePaymentsProps {
  transactionId?: string
  userId?: string
}
const TablePayments = (props: TablePaymentsProps) => {
  const { transactionId, userId } = props
  const { page, pageSize, setNewPage, changePageSize } = usePageRunner({
    alias: {
      page: 'payment-page',
      perPage: 'payment-per-page',
    },
  })
  const { mutate: confirmPayment } = useConfirmPayment()
  const { snackbar } = useSnackbar()

  const { data: paymentsPaginate, isLoading } = useGetPayments({
    userId,
    transactionId,
    page,
    limit: pageSize,
  })

  const dataSource = useMemo(() => {
    return paymentsPaginate
      ? paymentsPaginate?.items.map((payment) => {
          const { resource, createdAt, ...restPayment } = payment
          return {
            resource: resource
              ? [resource.name, resource.price].join(', ')
              : '-',
            ...restPayment,
            date: dayjs(createdAt)
              .tz('Asia/Bangkok')
              .format('DD/MM/YYYY hh:mm:ss'),
          }
        })
      : []
  }, [paymentsPaginate])

  type PaymentType = Exclude<typeof dataSource, undefined>

  const renderActions = useCallback(
    (data: PaymentType[number]) => {
      const { id: paymentId, status, user, price } = data
      return (
        <Authorize roles={[EnumRole.ADMIN, EnumRole.MANAGER]} allowLocalAdmin>
          <Button
            type="primary"
            onClick={() => {
              Modal.confirm({
                title: 'Confirm Payment',
                centered: true,
                content: (
                  <Col>
                    <Col>
                      <Typography.Text>
                        {`Confirm payment for : `}
                        <Typography.Text mark strong>
                          {`${user.name}`}
                        </Typography.Text>
                      </Typography.Text>
                    </Col>
                    <Col>
                      <Typography.Text strong>
                        {`Amount: ${numberWithCommas(price)}`}
                      </Typography.Text>
                    </Col>
                  </Col>
                ),
                onOk: () => {
                  confirmPayment(
                    {
                      paymentId,
                    },
                    {
                      onSuccess: () => {
                        snackbar({
                          type: 'success',
                          message: `Confirm Payment: ${
                            user.name
                          }, Price: ${numberWithCommas(price)}`,
                        })
                      },
                    },
                  )
                },
              })
            }}
            disabled={status !== PaymentStatus.PENDING}
          >
            Confirm
          </Button>
        </Authorize>
      )
    },
    [confirmPayment, snackbar],
  )

  const columns = useMemo(() => {
    const tmpColumns: ColumnType<typeof dataSource[number]>[] = [
      {
        title: 'Ref',
        dataIndex: 'ref',
      },
      {
        title: 'User Name',
        dataIndex: 'user',
        render: (value, record) => {
          const { user } = record
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
        title: 'Type',
        dataIndex: 'type',
      },
      {
        title: 'Price',
        dataIndex: 'price',
      },
      {
        title: (
          <Col>
            <Col>Transaction /</Col>
            <Col>Resource</Col>
          </Col>
        ),
        dataIndex: 'transaction',
        render: (value, record) => {
          const { transaction, resource } = record
          if (transaction) {
            const { id: transactionId, ref } = transaction
            return (
              <Link
                to={paths.transactionDetail({
                  routeParam: {
                    transactionId,
                  },
                })}
              >
                {ref?.toString().padStart(6, '0')}
              </Link>
            )
          }

          if (resource) {
            return <Typography>{resource}</Typography>
          }
        },
      },
      {
        title: 'Date',
        dataIndex: 'date',
      },
      {
        dataIndex: 'status',
        render: (value) => {
          return (
            <Tag
              color={
                value === PaymentStatus.FAILED
                  ? 'error'
                  : value === PaymentStatus.SETTLED
                  ? 'success'
                  : 'processing'
              }
            >
              {value}
            </Tag>
          )
        },
      },
      {
        render: (value, record) => {
          return renderActions(record)
        },
      },
    ]
    return tmpColumns
  }, [renderActions])

  return (
    <Page title={'Payment'}>
      <Table
        rowKey="id"
        dataSource={dataSource}
        columns={columns}
        loading={isLoading}
        pagination={{
          size: 'small',
          current: page,
          pageSize,
          total: paymentsPaginate?.meta.totalItems || 0,
          onChange: (page, pageSize) => {
            setNewPage(page)
            changePageSize(pageSize)
          },
        }}
      />
    </Page>
  )
}
export default TablePayments
