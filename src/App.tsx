/* eslint-disable no-template-curly-in-string */
import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Routes } from './routes'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter as Router } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { Suspense } from 'react'
import i18next from './constant/i18n'
import './initialize'
import { appVersion, withCtx } from './utils/helper'
import { AppCtx } from './constant/contexts'
import { AppSnackbar } from './components/AppSnackbar'
import { ConfigProvider, Spin, notification } from 'antd'
import { ApiErrorResponse } from './utils/api/tools'
import 'dayjs/locale/th'
import locale from 'antd/locale/th_TH'
import styled from '@emotion/styled'

const SpinLayout = styled.div`
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
`

console.info(`APP VERSION: ${appVersion}`)
const onError = (error: unknown) => {
  if (error instanceof ApiErrorResponse) {
    notification.error({
      message: 'Api Error',
      description: error.message,
      placement: 'bottomRight',
    })
  } else if (typeof error === 'string') {
    notification.error({
      message: 'Api Error',
      description: error,
      placement: 'bottomRight',
    })
  } else {
    notification.error({
      message: 'Api Error',
      description: JSON.stringify(error),
      placement: 'bottomRight',
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
              locale={locale}
              form={{
                validateMessages: {
                  required: '${label} is Required!',
                },
              }}
            >
              <Suspense
                fallback={
                  <SpinLayout>
                    <Spin tip="Loading">
                      <div className="content" />
                    </Spin>
                  </SpinLayout>
                }
              >
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
