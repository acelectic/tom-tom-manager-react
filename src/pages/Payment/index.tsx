import Page from '../../components/commons/Page'
// import { lazy } from 'react'
import TablePayments from '../../components/TablePayments'
// const PaymentForm = lazy(() => import('./PaymentForm'))

const Payment = () => {
  return (
    <Page title={'Payment Management'}>
      {/* <Authenlize roles={[Role.ADMIN, Role.MANAGER]}>
        <Suspense fallback={<div>Loading...</div>}>
          <PaymentForm />
        </Suspense>
      </Authenlize> */}
      <TablePayments />
    </Page>
  )
}
export default Payment
