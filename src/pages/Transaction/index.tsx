import Page from '../../components/commons/Page'
import TransactionForm from './TransactionForm'
import Authorize from '../../components/commons/Authorize'
import { EnumRole } from '../../services/auth/auth-types'
import TableTransactions from '../../components/TableTransactions'

const Transaction = () => {
  return (
    <Page title={'Transaction Management'}>
      <Authorize roles={[EnumRole.ADMIN, EnumRole.MANAGER]} allowLocalAdmin>
        <TransactionForm />
      </Authorize>
      <TableTransactions />
    </Page>
  )
}
export default Transaction
