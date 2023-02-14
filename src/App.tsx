/* eslint-disable no-template-curly-in-string */
import './App.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Routes } from './routes'
import { ReactQueryDevtools } from 'react-query-devtools'
import { BrowserRouter as Router } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { Suspense } from 'react'
import i18next from './constant/i18n'
import './initialize'
import { appVersion, withCtx } from './utils/helper'
import { AppCtx } from './constant/contexts'
import { AppSnackbar } from './components/AppSnackbar'
import { ConfigProvider, notification } from 'antd'
import { ApiErrorResponse } from './utils/api/tools'

console.info(`APP VERSION: ${appVersion}`)
const onError = (error: unknown) => {
  if (error instanceof ApiErrorResponse) {
    notification.error({
      message: 'Api Error',
      description: error.message,
    })
  } else if (typeof error === 'string') {
    notification.error({
      message: 'Api Error',
      description: error,
    })
  } else {
    notification.error({
      message: 'Api Error',
      description: JSON.stringify(error),
    })
  }
}
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError,
    },
    mutations: {
      onError,
    },
  },
})

const App = () => {
  return (
    <I18nextProvider i18n={i18next}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Suspense fallback={<div>...loading</div>}>
            <AppSnackbar />
            <ConfigProvider
              form={{
                validateMessages: {
                  required: '${label} is Required!',
                },
              }}
            >
              <Suspense fallback={<div>...</div>}>
                <Routes />
              </Suspense>
            </ConfigProvider>
          </Suspense>
        </Router>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </I18nextProvider>
  )
}

export default withCtx(AppCtx)(App)
