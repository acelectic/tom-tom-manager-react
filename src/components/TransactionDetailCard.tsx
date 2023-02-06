import { Divider, Grid, Paper } from '@material-ui/core'
import { capitalize, isNumber } from 'lodash'
import Text from './commons/Text'
import { numberWithCommas } from '../utils/helper'
import {
  modifyTransaction,
  useGetTransaction,
} from '../services/transaction/transaction-query'
import { useMemo } from 'react'
import Space from './commons/Space'

interface TransactionDetailCardProps {
  transactionId?: string
}
const TransactionDetailCard = (props: TransactionDetailCardProps) => {
  const { transactionId } = props
  const { data: transaction } = useGetTransaction({
    transactionId,
  })
  const customTransaction = useMemo(
    () => transaction && modifyTransaction(transaction),
    [transaction],
  )
  const { ref, price, remain, totalUser, meta } = customTransaction || {}
  const { resources = [] } = meta || {}

  return (
    <Space direction="column" spacing={20}>
      <Paper variant="elevation" elevation={5} style={{ padding: 20 }}>
        <Grid container direction="row" spacing={4}>
          <Grid item md={12}>
            <Text weight={600}>Transaction Detail</Text>
          </Grid>
        </Grid>
        <Grid container direction="row" spacing={4}>
          <Grid item md={3}>
            <Text>{`Ref: ${ref ? capitalize(ref) : '-'}`}</Text>
          </Grid>

          <Grid item md={3}>
            <Text>{`TotalUser: ${totalUser ? totalUser : '-'}`}</Text>
          </Grid>
          <Grid item md={3}>
            <Text>{`Price: ${
              isNumber(price) ? numberWithCommas(price) : '-'
            }`}</Text>
          </Grid>
          <Grid item md={3}>
            <Text>{`Remain: ${
              isNumber(remain) ? numberWithCommas(remain) : '-'
            }`}</Text>
          </Grid>
        </Grid>
      </Paper>
      <Paper variant="elevation" elevation={5} style={{ padding: 20 }}>
        <Grid container direction="row" spacing={4}>
          <Grid item md={12}>
            <Text weight={600}>Resource</Text>
          </Grid>
        </Grid>

        {resources?.map(resource => {
          const { id, ref, name, price } = resource
          return (
            <Grid key={id} container direction="row" spacing={4}>
              <Grid item md={3}>
                <Text>{`Ref: ${ref.toString().padStart(6, '0') || '-'}`}</Text>
              </Grid>

              <Grid item md={3}>
                <Text>{`Name: ${name}`}</Text>
              </Grid>
              <Grid item md={3}>
                <Text>{`Price: ${
                  isNumber(price) ? numberWithCommas(price) : '-'
                }`}</Text>
              </Grid>
            </Grid>
          )
        })}
      </Paper>
    </Space>
  )
}
export default TransactionDetailCard
