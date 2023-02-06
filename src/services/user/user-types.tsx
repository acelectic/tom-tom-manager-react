import { Role, UserEntity } from '../auth/auth-types'

export interface GetUsersParams extends PaginationParams {
  transactionId?: string
}
export interface GetUsersResponse extends Pagination<UserEntity> {}

export interface GetUserResponse extends UserEntity {}
export interface ChangeRoleParams {
  userId: string
  role: Role
}

export interface UpdateUserParams {
  userId: string
  name: string
  role: Role
  password: string
}
