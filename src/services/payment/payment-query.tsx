import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from 'react-query'
import { api } from '../../utils/api'
import {
  TRANSACTION_HISTORY_URL,
  TRANSACTION_URL,
} from '../transaction/transaction-query'
import { USER_URL } from '../user/user-query'
import {
  ConfirmPaymentParams,
  ConfirmPaymentResponse,
  ConfirmUserAllPaymentParams,
  ConfirmUserAllPaymentResponse,
  CreatePaymentParams,
  CreatePaymentResponse,
  GetPaymentsParams,
  GetPaymentsResponse,
  PaymentType,
} from './payment-types'

export const PAYMENT_URL = 'payments'
export const CONFIRM_USER_PAYMENTS = `${PAYMENT_URL}/confirm-all`

export const useGetPayments = (
  params?: GetPaymentsParams,
  option?: UseQueryOptions<GetPaymentsResponse>,
) => {
  return useQuery(
    [PAYMENT_URL, { params }],
    async () => {
      const { data } = await api.tomtom.get<GetPaymentsResponse>(
        PAYMENT_URL,
        params,
      )
      return data
    },
    { keepPreviousData: true, ...option },
  )
}

export const useCreatePayment = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async (params: CreatePaymentParams) => {
      const { userId, resourceId, transactionId, type, price } = params
      const { data } = await api.tomtom.post<CreatePaymentResponse>(
        PAYMENT_URL,
        {
          userId,
          type,
          resourceId: type === PaymentType.BUY ? resourceId : undefined,
          transactionId: type === PaymentType.PAID ? transactionId : undefined,
          price: Number(price),
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

export const useConfirmPayment = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async (params: ConfirmPaymentParams) => {
      const { paymentId } = params
      const { data } = await api.tomtom.post<ConfirmPaymentResponse>(
        `${PAYMENT_URL}/${paymentId}/confirm`,
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

export const useConfirmUserAllPayments = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async (params: ConfirmUserAllPaymentParams) => {
      const { data } = await api.tomtom.post<ConfirmUserAllPaymentResponse>(
        `${CONFIRM_USER_PAYMENTS}`,
        params,
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
