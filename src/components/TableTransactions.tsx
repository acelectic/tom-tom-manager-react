import { useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import paths from '../constant/paths'
import { EnumRole } from '../services/auth/auth-types'
import {
  useGetTransactions,
  modifyTransaction,
} from '../services/transaction/transaction-query'
import { usePageRunner } from '../utils/custom-hook'
import Authorize from './commons/Authorize'
import Page from './commons/Page'
import { Button, Table, Tag } from 'antd'
import { ColumnType } from 'antd/es/table'

interface TableTransactionsProps {
  userId?: string
}
const TableTransactions = (props: TableTransactionsProps) => {
  const { userId } = props
  const { page, pageSize, setNewPage, changePageSize } = usePageRunner({
    alias: {
      page: 'transaction-page',
      perPage: 'transaction-per-page',
    },
  })

  const { data: transactionsPaginate, isLoading } = useGetTransactions({
    userId,
    page,
    limit: pageSize,
  })
  const dataSource = useMemo(() => {
    return transactionsPaginate
      ? transactionsPaginate?.items.map(modifyTransaction)
      : []
  }, [transactionsPaginate])

  const renderActions = useCallback((data: typeof dataSource[number]) => {
    return (
      <Authorize roles={[EnumRole.ADMIN, EnumRole.MANAGER]} allowLocalAdmin>
        <Link
          to={paths.transactionDetail({
            routeParam: {
              transactionId: data.id,
            },
          })}
        >
          <Button type="link" color={'primary'} size="small">
            See Detail
          </Button>
        </Link>
      </Authorize>
    )
  }, [])

  const columns = useMemo(() => {
    const tmpColumns: ColumnType<typeof dataSource[number]>[] = [
      {
        title: 'Ref',
        dataIndex: 'ref',
      },
      {
        title: 'Total User',
        dataIndex: 'totalUser',
      },
      {
        title: 'Remain',
        dataIndex: 'remain',
      },
      {
        title: 'Price',
        dataIndex: 'price',
      },
      {
        title: 'Date',
        dataIndex: 'date',
      },
      {
        dataIndex: 'completed',
        render: (value) => {
          return (
            <Tag color={value === 'Completed' ? 'success' : 'processing'}>
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
    <Page title={'Transaction'}>
      <Table
        rowKey="id"
        dataSource={dataSource}
        columns={columns}
        loading={isLoading}
        pagination={{
          size: 'small',
          current: page,
          pageSize,
          total: transactionsPaginate?.meta.totalItems || 0,
          onChange: (page, pageSize) => {
            setNewPage(page)
            changePageSize(pageSize)
          },
        }}
      />
    </Page>
  )
}
export default TableTransactions
