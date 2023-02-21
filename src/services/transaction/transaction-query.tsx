import dayjs from 'dayjs'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../utils/api'
import {
  CreateTransactionParams,
  CreateTransactionResponse,
  GetTransactionsHistoryParams,
  GetTransactionsHistoryResponse,
  GetTransactionsParams,
  GetTransactionsResponse,
  TransactionEntity,
  GetTransactionParams,
  GetTransactionResponse,
} from './transaction-types'
import { PAYMENT_URL } from '../payment/payment-query'
import { USER_URL } from '../user/user-query'

export const TRANSACTION_URL = 'transactions'
export const TRANSACTION_HISTORY_URL = `${TRANSACTION_URL}/history`

export const useGetTransactions = (
  params?: GetTransactionsParams,
  option?: OmitReactQueryOptions<GetTransactionsResponse>,
) => {
  return useQuery(
    [TRANSACTION_URL, { params }],
    async () => {
      const { data } = await api.tomtom.get<GetTransactionsResponse>(
        TRANSACTION_URL,
        params,
      )
      return data
    },
    {
      keepPreviousData: true,
      ...option,
    },
  )
}

export const useGetTransaction = (
  params?: GetTransactionParams,
  option?: OmitReactQueryOptions<GetTransactionResponse>,
) => {
  const { transactionId } = params || {}
  return useQuery(
    [TRANSACTION_URL, params],
    async () => {
      const { data } = await api.tomtom.get<GetTransactionResponse>(
        `${TRANSACTION_URL}/${transactionId}`,
      )
      return data
    },
    {
      enabled: !!transactionId,
      ...option,
    },
  )
}

export const useGetTransactionsHistory = (
  params?: GetTransactionsHistoryParams,
) => {
  return useQuery(
    [TRANSACTION_URL, TRANSACTION_HISTORY_URL, { ...params }],
    async () => {
      const { data } = await api.tomtom.get<GetTransactionsHistoryResponse>(
        TRANSACTION_HISTORY_URL,
        params,
      )
      return data.transactions
    },
  )
}

export const useCreateTransaction = () => {
  const queryClient = useQueryClient()
  return useMutation(
    [TRANSACTION_URL],
    async (params: CreateTransactionParams) => {
      const { userIds, templateId } = params
      const { data } = await api.tomtom.post<CreateTransactionResponse>(
        TRANSACTION_URL,
        {
          userIds,
          templateId,
        },
      )
      return data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([PAYMENT_URL])
        queryClient.invalidateQueries([TRANSACTION_URL])
        queryClient.invalidateQueries([TRANSACTION_HISTORY_URL])
        queryClient.invalidateQueries([USER_URL])
      },
    },
  )
}

export const modifyTransaction = (transaction: TransactionEntity) => {
  const { ref, users, resources, createdAt, completed, ...restTransaction } =
    transaction
  return {
    ...restTransaction,
    ref: ref.toString().padStart(6, '0'),
    totalUser: users?.length || 0,
    completed: completed ? 'Completed' : 'Pending',
    date: dayjs(createdAt).tz('Asia/Bangkok').format('DD/MM/YYYY hh:mm:ss'),
  }
}
