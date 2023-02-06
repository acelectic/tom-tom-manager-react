import React from 'react'
import Page from '../../components/commons/Page'
import TransactionSummary from './TransactionSummary'

const Dashboard = () => {
  return (
    <Page title="Dashboard">
      <TransactionSummary />
    </Page>
  )
}

export default Dashboard
