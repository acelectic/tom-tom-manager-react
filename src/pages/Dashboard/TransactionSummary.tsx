import { useMemo, useState } from 'react'
import { useGetTransactionsHistory } from '../../services/transaction/transaction-query'
import dayjs from 'dayjs'
import { groupBy, range, sortBy, sumBy } from 'lodash'
import { DatePickerField, SelectField } from '../../components/fields'
import { Form } from 'react-final-form'
import { OnChange } from 'react-final-form-listeners'
import { Grid, Typography } from '@material-ui/core'
import { numberWithCommas } from '../../utils/helper'
import Space from '../../components/commons/Space'
import TransactionChart from '../../components/TransactionChart'

const colors = ['#91cf96', '#c881d2', '#ffbaa2', '#29b6f6'] as const

const dataSetOpts = {
  fill: false,
  lineTension: 0.1,
  backgroundColor: 'white',
  // backgroundColor: 'rgba(75,192,192,0.4)',
  borderCapStyle: 'butt',
  borderDash: [],
  borderDashOffset: 0.0,
  borderJoinStyle: 'miter',
  pointBackgroundColor: '#fff',
  pointBorderWidth: 1,
  pointHoverRadius: 5,
  // pointHoverBackgroundColor: 'rgba(75,192,192,1)',
  // pointHoverBorderColor: 'rgba(220,220,220,1)',
  pointHoverBorderWidth: 2,
  pointRadius: 1,
  pointHitRadius: 10,
  responsive: true,
}

const TransactionSummary = () => {
  const [startDate, setStartDate] = useState(dayjs().subtract(7, 'day'))
  const [endDate, setEndDate] = useState(dayjs())
  const [status, setStatus] = useState()

  const { data: transactions } = useGetTransactionsHistory({
    status,
    // endDate: endDate
    //   .millisecond(0)
    //   .second(0)
    //   .minute(0)
    //   .hour(0)
    //   .toISOString(),
    startDate: startDate
      .millisecond(0)
      .second(0)
      .minute(0)
      .hour(0)
      .toISOString(),
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
    const data = range(dateRange).map(d => {
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
        ? transactionData.map(d => dayjs(d.date).format('DD/MM/YYYY'))
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
          data: transactionData ? transactionData.map(d => d.sumPrice) : [],
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
            ? transactionData.map(d => d.sumRemainPrice)
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
          data: transactionData ? transactionData.map(d => d.sumUsers) : [],
        },
        {
          // ...dataSetOpts,
          label: 'Total Transaction',
          yAxisID: 'TotalUser',
          borderColor: colors[3],
          pointBorderColor: colors[3],
          pointHoverBackgroundColor: colors[3],
          // pointHoverBorderColor: colors[0],
          data: transactionData ? transactionData.map(d => d.numTr) : [],
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

  const totalPrice = useMemo(
    () => sumBy(transactionData, ({ sumPrice }) => sumPrice),
    [transactionData],
  )
  const totalRemianPrice = useMemo(
    () => sumBy(transactionData, ({ sumRemainPrice }) => sumRemainPrice),
    [transactionData],
  )
  const totalUser = useMemo(
    () => sumBy(transactionData, ({ sumUsers }) => sumUsers),
    [transactionData],
  )
  const totalTr = useMemo(() => sumBy(transactionData, ({ numTr }) => numTr), [
    transactionData,
  ])
  return (
    <div>
      <Grid container>
        <Grid item md={3}>
          <Typography variant="h6">{`TotalPrice: ${numberWithCommas(
            totalPrice,
          )}`}</Typography>
        </Grid>
        <Grid item md={3}>
          <Typography variant="h6">{`TotalRemianPrice: ${numberWithCommas(
            totalRemianPrice,
          )}`}</Typography>
        </Grid>
        <Grid item md={3}>
          <Typography variant="h6">{`TotalUser: ${numberWithCommas(
            totalUser,
          )}`}</Typography>
        </Grid>
        <Grid item md={3}>
          <Typography variant="h6">{`TotalTr: ${numberWithCommas(
            totalTr,
          )}`}</Typography>
        </Grid>
      </Grid>
      <Form
        onSubmit={() => {}}
        subscription={{ values: true }}
        initialValues={{
          startDate,
          endDate,
        }}
      >
        {({ form }) => {
          return (
            <Space direction="row" style={{ marginTop: 20, marginBottom: 20 }}>
              <div>
                <SelectField
                  name="status"
                  label="Status"
                  options={statusOptions}
                />
                <OnChange name="status">
                  {value => {
                    setStatus(value)
                  }}
                </OnChange>
              </div>
              <div>
                <DatePickerField
                  name="startDate"
                  label="StartDate"
                  minDate={dayjs()
                    .subtract(30, 'day')
                    .toDate()}
                  maxDate={endDate.toDate()}
                  allowNull
                  todayLabel="Today"
                  showTodayButton
                />
                <OnChange name="startDate">
                  {value => {
                    const newDate = dayjs(value)
                    if (startDate.diff(newDate) !== 0) {
                      setStartDate(newDate)
                    }
                  }}
                </OnChange>
              </div>
              <div>
                <DatePickerField
                  name="endDate"
                  label="EndDate"
                  maxDate={dayjs().toDate()}
                  allowNull
                  todayLabel="Today"
                  showTodayButton
                />
                <OnChange name="endDate">
                  {value => {
                    const newDate = dayjs(value)
                    if (endDate.diff(newDate) !== 0) {
                      setEndDate(newDate)
                    }
                    if (endDate < startDate && startDate.diff(newDate) !== 0) {
                      setStartDate(newDate)
                    }
                  }}
                </OnChange>
              </div>
            </Space>
          )
        }}
      </Form>
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
    </div>
  )
}
export default TransactionSummary
