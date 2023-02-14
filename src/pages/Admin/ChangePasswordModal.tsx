import {
  Ref,
  useCallback,
  useContext,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'
import { ChangePasswordCtx } from '../../constant/contexts'
import { IUserEntity } from '../../services/auth/auth-types'
import { Form, Input, Modal } from 'antd'
import { IAdminChangePasswordParams } from '../../services/admin/auth-types'
import { useChangePassword } from '../../services/admin/auth-query'

type IUserInfo = Pick<IUserEntity, 'id' | 'name' | 'email'>
type IChangePasswordModalFormValues = IAdminChangePasswordParams &
  IUserInfo & {
    confirmPassword: string
  }

interface IChangePasswordFormRef {
  submit: () => void
}
interface IChangePasswordFormProps {
  elmRef: Ref<IChangePasswordFormRef>
  initialValues?: IUserInfo
}

const ChangePasswordForm = (props: IChangePasswordFormProps) => {
  const { elmRef, initialValues } = props

  const [form] = Form.useForm<IChangePasswordModalFormValues>()
  const { mutate: changePassword } = useChangePassword()

  const [, , { reset }] = useContext(ChangePasswordCtx)

  const handleClose = useCallback(() => {
    reset()
  }, [reset])

  const onSubmit = useCallback(
    (values: IChangePasswordModalFormValues) => {
      const { email, password } = values
      changePassword(
        {
          email,
          password,
        },
        {
          onSuccess: () => {
            handleClose()
          },
        },
      )
    },
    [handleClose, changePassword],
  )

  useImperativeHandle(
    elmRef,
    () => {
      return {
        submit: () => {
          form.submit()
        },
      }
    },
    [form],
  )

  return (
    <Form<IChangePasswordModalFormValues>
      form={form}
      onFinish={onSubmit}
      initialValues={initialValues}
      layout="vertical"
    >
      <Form.Item name="name" label="Name">
        <Input disabled />
      </Form.Item>
      <Form.Item name="email" label="Email">
        <Input disabled />
      </Form.Item>
      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            type: 'string',
            required: true,
          },
          {
            type: 'regexp',
            pattern:
              /((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))/gm,
          },
          (formCtx) => ({
            validator: () => {
              const password = formCtx.getFieldValue('password')
              const confirmPassword = formCtx.getFieldValue('confirmPassword')
              if (password && confirmPassword && password !== confirmPassword) {
                return Promise.reject('รหัสผ่านไม่ตรงกัน')
              }
              return Promise.resolve()
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="confirmPassword"
        label="Confirm Password"
        rules={[
          {
            type: 'string',
            required: true,
          },
          {
            type: 'regexp',
            pattern:
              /((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))/gm,
          },
          (formCtx) => ({
            validator: () => {
              const password = formCtx.getFieldValue('password')
              const confirmPassword = formCtx.getFieldValue('confirmPassword')
              if (password && confirmPassword && password !== confirmPassword) {
                return Promise.reject('รหัสผ่านไม่ตรงกัน')
              }
              return Promise.resolve()
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
    </Form>
  )
}

const ChangePasswordModal = () => {
  const formElmRef = useRef<IChangePasswordFormRef>(null)
  const [state, setState] = useContext(ChangePasswordCtx)
  const { visible, email, name, userId } = state

  const initialValues = useMemo(() => {
    return {
      id: userId,
      email,
      name,
    }
  }, [email, name, userId])

  const onOk = useCallback(() => {
    formElmRef.current?.submit?.()
  }, [])

  const onCancel = useCallback(() => {
    setState({ visible: false })
  }, [setState])

  return (
    <Modal open={visible} onCancel={onCancel} onOk={onOk} destroyOnClose>
      <ChangePasswordForm elmRef={formElmRef} initialValues={initialValues} />
    </Modal>
  )
}

export default ChangePasswordModal
