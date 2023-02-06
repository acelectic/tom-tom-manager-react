import { Switch, Route, Redirect } from 'react-router-dom'
import Authorize from '../components/commons/Authorize'
import Layout from '../components/layout'
import paths from '../constant/paths'
import Admin from '../pages/Admin'
import Dashboard from '../pages/Dashboard'
import Payment from '../pages/Payment'
import Resource from '../pages/Resource'
import Setting from '../pages/Setting'
import Transaction from '../pages/Transaction'
import TransactionDetail from '../pages/Transaction/TransactionDetail'
import Users from '../pages/User'
import UserDetial from '../pages/User/UserDetail'

export const ProtectedRoute = () => {
  return (
    <Layout>
      <Switch>
        <Redirect exact from="/" to={paths.dashboard()} />
        <Route path={paths.dashboard()} component={Dashboard} />

        <Route path={paths.userDetail()} component={UserDetial} />
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
