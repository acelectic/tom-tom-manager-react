import { Paper } from '@material-ui/core'
import { capitalize, isNumber } from 'lodash'
import Space from './commons/Space'
import Text from './commons/Text'
import { numberWithCommas } from '../utils/helper'
import { useGetUser } from '../services/user/user-query'

interface UserDetailCardProps {
  userId?: string
}
const UserDetailCard = (props: UserDetailCardProps) => {
  const { userId } = props
  const { data: user } = useGetUser(userId)
  const { name, role, balance } = user || {}
  return (
    <Paper variant="elevation" elevation={5} style={{ padding: 20 }}>
      <Space direction="column" spacing={10}>
        <Text>{`Name: ${name ? capitalize(name) : '-'}`}</Text>
        <Text>{`Role: ${role ? capitalize(role) : '-'}`}</Text>
        <Text>{`Balance: ${
          isNumber(balance) ? numberWithCommas(balance) : '-'
        }`}</Text>
      </Space>
    </Paper>
  )
}
export default UserDetailCard
