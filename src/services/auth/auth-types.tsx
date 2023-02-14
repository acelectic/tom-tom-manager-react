// const USER_RELATION = [
//   'position',
//   'position.department',
//   'position.department.jobFunction',
//   'idpPlanningsApproves',
// ] as const
// export type GetUserIncludesRelation = typeof USER_RELATION[number][]
// export type GetUserParams = {
//   userId: string
//   relations?: GetUserIncludesRelation

import { PaymentEntity } from '../payment/payment-types'

// }
export enum EnumRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
  VIEWER = 'viewer',
}

export interface IUserEntity {
  id: string
  createdAt: string
  updatedAt: string
  deletedAt: string
  email: string
  lastSignInAt: string
  name: string
  role: EnumRole
  balance: number
  payments?: PaymentEntity[]
}
export type ISignInParams = {
  email: string
  password: string
  name?: string
}

export type ISignInResponse = {
  accessToken: string
  refreshToken: string
  user: IUserEntity
}

export type IRefreshTokenResponse = {
  accessToken: string
  refreshToken: string
}

export interface IForgotPasswordParams {
  email: string
}

export interface IForgotPasswordResponse {
  newPassword: string
}
