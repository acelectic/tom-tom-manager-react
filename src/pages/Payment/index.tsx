import loadable from '@loadable/component'
import Page from '../../components/commons/Page'
import TablePayments from '../../components/TablePayments'
import { EnumRole } from '../../services/auth/auth-types'
import Authorize from '../../components/commons/Authorize'
import { Suspense } from 'react'

const PaymentForm = loadable(() => import('./PaymentForm'))

const Payment = () => {
  return (
    <Page title={'Payment Management'}>
      <Authorize roles={[EnumRole.ADMIN, EnumRole.MANAGER]} allowLocalAdmin>
        <Suspense fallback={<div>Loading...</div>}>
          <PaymentForm />
        </Suspense>
      </Authorize>
      <TablePayments />
    </Page>
  )
}
export default Payment
