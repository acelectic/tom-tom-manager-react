export interface IAdminResetPasswordParams {
  email: string
}

export interface IAdminResetPasswordResponse {
  password: string
}

export interface IAdminChangePasswordParams {
  email: string
  password: string
}

export interface IAdminChangePasswordResponse {
  email: string
}
