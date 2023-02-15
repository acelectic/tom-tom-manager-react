import { useCallback, useMemo } from 'react'
import { useGetTransactionsHistory } from '../../services/transaction/transaction-query'
import dayjs, { Dayjs } from 'dayjs'
import { groupBy, range, sortBy, sumBy } from 'lodash'
import TransactionChart from '../../components/TransactionChart'
import { DatePicker, Form, Row, Col, Select, Table } from 'antd'
import { ColumnType } from 'antd/es/table'
import { RangePickerProps } from 'antd/es/date-picker'
import shortid from 'shortid'

const colors = ['#91cf96', '#c881d2', '#ffbaa2', '#29b6f6'] as const

const rangePresets: RangePickerProps['presets'] = [
  { label: 'Last 7 Days', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: 'Last 14 Days', value: [dayjs().add(-14, 'd'), dayjs()] },
  { label: 'Last 30 Days', value: [dayjs().add(-30, 'd'), dayjs()] },
  { label: 'Last 90 Days', value: [dayjs().add(-90, 'd'), dayjs()] },
]

interface ISummaryData {
  key: string
  totalPrice: number
  totalRemainPrice: number
  totalUser: number
  totalTr: number
}

interface IFilterValues {
  status: 'All' | true | false
  dateFilter: [Dayjs, Dayjs]
}

const TransactionSummary = () => {
  const [form] = Form.useForm<IFilterValues>()
  const status = Form.useWatch('status', form)
  const dateFilter = Form.useWatch('dateFilter', form)
  const [startDate, endDate] = dateFilter || [
    dayjs().subtract(7, 'day'),
    dayjs(),
  ]

  const { data: transactions } = useGetTransactionsHistory({
    status: status === 'All' ? undefined : status,
    startDate: startDate.endOf('day').toISOString(),
  })

  const transactionsGroupByDate = useMemo(
    () =>
      groupBy(transactions, ({ createdAt }) =>
        dayjs(createdAt).format('DD/MM/YYYY'),
      ),
    [transactions],
  )
  const transactionData = useMemo(() => {
    const start = startDate
    const dateRange = endDate.diff(start, 'day') + 1
    const data = range(dateRange).map((d) => {
      const curDate = start.add(d, 'day')
      const transactionByCurDate =
        transactionsGroupByDate[curDate.format('DD/MM/YYYY')]
      const sumPrice = sumBy(transactionByCurDate, ({ price }) => Number(price))
      const sumRemainPrice = sumBy(transactionByCurDate, ({ remain }) =>
        Number(remain),
      )
      const sumUsers = sumBy(transactionByCurDate, ({ users }) =>
        Number(users?.length || 0),
      )
      return {
        date: curDate.format('DD/MM/YYYY'),
        sumPrice,
        sumRemainPrice,
        sumUsers,
        numTr: transactionByCurDate?.length || 0,
      }
    })
    return sortBy(data, ({ date }) => date)
  }, [endDate, startDate, transactionsGroupByDate])
  // const { data: transactionsHistory } = useGetTransactionsHistory()
  const data = useMemo(() => {
    const data = {
      labels: transactionData
        ? transactionData.map((d) => dayjs(d.date).format('DD/MM/YYYY'))
        : [],
      datasets: [
        {
          // ...dataSetOpts,
          label: 'Price',
          yAxisID: 'Price',
          borderColor: colors[0],
          pointBorderColor: colors[0],
          pointHoverBackgroundColor: colors[0],
          // pointHoverBorderColor: colors[1],
          data: transactionData ? transactionData.map((d) => d.sumPrice) : [],
        },
        {
          // ...dataSetOpts,
          label: 'Remain',
          yAxisID: 'Remain',
          borderColor: colors[1],
          pointBorderColor: colors[1],
          pointHoverBackgroundColor: colors[1],
          // pointHoverBorderColor: colors[1],
          data: transactionData
            ? transactionData.map((d) => d.sumRemainPrice)
            : [],
        },
        {
          // ...dataSetOpts,
          label: 'Total User',
          yAxisID: 'TotalUser',
          borderColor: colors[2],
          pointBorderColor: colors[2],
          pointHoverBackgroundColor: colors[2],
          // pointHoverBorderColor: colors[0],
          data: transactionData ? transactionData.map((d) => d.sumUsers) : [],
        },
        {
          // ...dataSetOpts,
          label: 'Total Transaction',
          yAxisID: 'TotalUser',
          borderColor: colors[3],
          pointBorderColor: colors[3],
          pointHoverBackgroundColor: colors[3],
          // pointHoverBorderColor: colors[0],
          data: transactionData ? transactionData.map((d) => d.numTr) : [],
        },
      ],
    }
    return data
  }, [transactionData])

  const statusOptions = useMemo((): BaseOptions[] => {
    return [
      {
        label: 'All',
        value: 'All',
      },
      {
        label: 'Pending',
        value: false,
      },
      {
        label: 'Completed',
        value: true,
      },
    ]
  }, [])

  const initialValues = useMemo((): IFilterValues => {
    return {
      status: 'All',
      dateFilter: [dayjs().subtract(7, 'day'), dayjs()],
    }
  }, [])

  const totalPrice = useMemo(
    () => sumBy(transactionData, ({ sumPrice }) => sumPrice),
    [transactionData],
  )

  const totalRemainPrice = useMemo(
    () => sumBy(transactionData, ({ sumRemainPrice }) => sumRemainPrice),
    [transactionData],
  )

  const totalUser = useMemo(
    () => sumBy(transactionData, ({ sumUsers }) => sumUsers),
    [transactionData],
  )

  const totalTr = useMemo(
    () => sumBy(transactionData, ({ numTr }) => numTr),
    [transactionData],
  )

  const dataSource = useMemo((): ISummaryData[] => {
    return [
      {
        key: shortid(),
        totalPrice,
        totalRemainPrice,
        totalUser,
        totalTr,
      },
    ]
  }, [totalPrice, totalRemainPrice, totalTr, totalUser])

  const columns = useMemo((): ColumnType<ISummaryData>[] => {
    return [
      {
        dataIndex: 'totalPrice',
        title: 'Total Price',
      },
      {
        dataIndex: 'totalRemainPrice',
        title: 'Total Remain Price',
      },
      {
        dataIndex: 'totalUser',
        title: 'Total User',
      },
      {
        dataIndex: 'totalTr',
        title: 'Total Tr',
      },
    ]
  }, [])

  const disabledDate = useCallback(
    (d) => {
      const date = dayjs(d)
      const minDate = dayjs().subtract(30, 'day')
      const maxDate = endDate
      return (
        date.isAfter(maxDate, 'd') ||
        date.isSame(maxDate, 'd') ||
        date.isBefore(minDate, 'd') ||
        date.isSame(minDate, 'd')
      )
    },
    [endDate],
  )
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Table
          rowKey="key"
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />
      </Col>
      <Col span={24}>
        <Form form={form} initialValues={initialValues} layout="vertical">
          <Row gutter={[16, 16]}>
            <Col span={7}>
              <Form.Item name="status" label="Status">
                <Select options={statusOptions} />
              </Form.Item>
            </Col>
            <Col span={14}>
              <Form.Item name="dateFilter" label="Date Filter">
                <DatePicker.RangePicker
                  presets={rangePresets}
                  disabledDate={disabledDate}
                  format="YYYY/MM/DD"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Col>
      <Col span={24}>
        <TransactionChart
          data={transactionData}
          xAixKey={'date'}
          renderOptions={[
            {
              label: 'RemainPrice',
              key: 'sumRemainPrice',
              color: colors[0],
            },
            {
              label: 'Price',
              key: 'sumPrice',
              color: colors[1],
            },
            {
              label: 'Users',
              key: 'sumUsers',
              color: colors[3],
            },
          ]}
          chartOption={{
            // sumPrice: {
            //   min: 0,
            //   max: 3000,
            // },
            // sumRemainPrice: {
            //   min: 0,
            //   max: 3000,
            // },
            sumUsers: {
              position: 'right',
              type: 'linear',
            },
          }}
        />
      </Col>
    </Row>
  )
}
export default TransactionSummary
