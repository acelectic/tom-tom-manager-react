import Page from '../../../components/commons/Page'
import Space from '../../../components/commons/Space'
import TablePayments from '../../../components/TablePayments'
import TableTransactions from '../../../components/TableTransactions'
import UserDetailCard from '../../../components/UserDetailCard'
import { useRouter } from '../../../utils/helper'

const UserDetial = () => {
  const { query } = useRouter<{ userId: string }>()
  const { userId } = query
  return (
    <Page title={''}>
      <Space direction="column" spacing={40}>
        <UserDetailCard userId={userId} />
        <TableTransactions userId={userId} />
        <TablePayments userId={userId} />
      </Space>
    </Page>
  )
}

export default UserDetial
