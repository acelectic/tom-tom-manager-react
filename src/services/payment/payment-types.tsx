import { IUserEntity } from '../auth/auth-types'
import { ResourceEntity } from '../resource/resource-types'
import { TransactionEntity } from '../transaction/transaction-types'

export enum PaymentType {
  BUY = 'buy',
  PAID = 'paid',
}
export enum PaymentStatus {
  PENDING = 'pending',
  FAILED = 'failed',
  SETTLED = 'settled',
}

export interface GetPaymentsParams extends PaginationParams {
  userId?: string
  transactionId?: string
}
export interface PaymentEntity {
  id: string
  ref: number
  price: number
  type: PaymentType
  user: IUserEntity
  resource: ResourceEntity
  transaction: TransactionEntity
  createdAt: string
  status: PaymentStatus
}

export interface GetPaymentsResponse extends Pagination<PaymentEntity> {}

export interface CreatePaymentParams {
  price: number
  type: PaymentType
  userId: string
  transactionId: string
  resourceId: string
}
export interface CreatePaymentResponse extends PaymentEntity {}

export interface ConfirmPaymentParams {
  paymentId: string
}

export interface ConfirmPaymentResponse extends PaymentEntity {}

export interface ConfirmUserAllPaymentParams {
  userId: string
}
export interface ConfirmUserAllPaymentResponse {
  payments: PaymentEntity[]
}
