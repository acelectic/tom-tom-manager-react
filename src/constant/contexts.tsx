import { AppSnackbarProps } from '../components/AppSnackbar'
import { ITemplateFormValues } from '../pages/SettingTemplate/TemplateFormModal'
import { EnumRole } from '../services/auth/auth-types'
import { createCtx } from '../utils/helper'

const AppSnackbarOption: AppSnackbarProps = {
  visible: false,
  message: '',
  type: 'info',
}
export const AppCtx = createCtx({
  appSnackbar: AppSnackbarOption,
})
export const UpdateUserCtx = createCtx({
  visible: false,
  userId: '',
  name: '',
  password: '',
  role: '' as EnumRole,
})

export const ChangePasswordCtx = createCtx({
  visible: false,
  userId: '',
  name: '',
  email: '',
})

interface TemplateFormValuesCtx extends ITemplateFormValues {
  visible: boolean
}
export const TemplateFormCtx = createCtx({
  name: '',
  description: '',
  visible: false,
  isActive: undefined as unknown as boolean,
  ref: '',
  resourceIds: [],
} as TemplateFormValuesCtx)
