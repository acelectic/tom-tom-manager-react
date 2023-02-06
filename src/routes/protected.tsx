import { Switch, Route, Redirect } from 'react-router-dom'
import Authorize from '../components/commons/Authorize'
import Layout from '../components/layout'
import paths from '../constant/paths'
import loadable from '@loadable/component'

const Admin = loadable(() => import('../pages/Admin'))
const Dashboard = loadable(() => import('../pages/Dashboard'))
const Payment = loadable(() => import('../pages/Payment'))
const Resource = loadable(() => import('../pages/Resource'))
const Setting = loadable(() => import('../pages/Setting'))
const Transaction = loadable(() => import('../pages/Transaction'))
const Users = loadable(() => import('../pages/User'))
const TransactionDetail = loadable(
  () => import('../pages/Transaction/TransactionDetail'),
)
const UserDetail = loadable(() => import('../pages/User/UserDetail'))

export const ProtectedRoute = () => {
  return (
    <Layout>
      <Switch>
        <Redirect exact from="/" to={paths.dashboard()} />
        <Route path={paths.dashboard()} component={Dashboard} />

        <Route path={paths.userDetail()} component={UserDetail} />
        <Route path={paths.users()} component={Users} />

        <Route path={paths.resources()} component={Resource} />

        <Route path={paths.transactionDetail()} component={TransactionDetail} />
        <Route path={paths.transactions()} component={Transaction} />

        <Route path={paths.payments()} component={Payment} />
        <Route path={paths.setting()} component={Setting} />
        <Authorize allowLocalAdmin>
          <Route path={paths.admin()} component={Admin} />
        </Authorize>
        <Redirect to={paths.notFound()} />
      </Switch>
    </Layout>
  )
}

export default ProtectedRoute
