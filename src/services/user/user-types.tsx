import { EnumRole, IUserEntity } from '../auth/auth-types'

export interface GetUsersParams extends PaginationParams {
  transactionId?: string
}
export interface GetUsersResponse extends Pagination<IUserEntity> {}

export interface GetUserResponse extends IUserEntity {}
export interface ChangeRoleParams {
  userId: string
  role: EnumRole
}

export interface UpdateUserParams {
  userId: string
  name: string
  role: EnumRole
  password: string
}
