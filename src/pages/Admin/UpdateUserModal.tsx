import {
  Ref,
  useCallback,
  useContext,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'
import { UpdateUserCtx } from '../../constant/contexts'
import { useUpdateUser } from '../../services/user/user-query'
import { EnumRole } from '../../services/auth/auth-types'
import { UpdateUserParams } from '../../services/user/user-types'
import { capitalize } from 'lodash'
import { Form, Input, Modal, Select } from 'antd'

interface UpdateUserFormValues extends Omit<UpdateUserParams, 'userId'> {}

interface IUpdateUserFormRef {
  submit: () => void
}
interface IUpdateUserFormProps {
  elmRef: Ref<IUpdateUserFormRef>
}

const UpdateUserForm = (props: IUpdateUserFormProps) => {
  const { elmRef } = props

  const [form] = Form.useForm<UpdateUserFormValues>()
  const { mutate: updateUser } = useUpdateUser()
  const [state, , { reset }] = useContext(UpdateUserCtx)
  const { userId, name, password, role } = state

  const handleClose = useCallback(() => {
    reset()
  }, [reset])

  const onSubmit = useCallback(
    (values: UpdateUserFormValues) => {
      const { name, password, role } = values
      updateUser(
        {
          userId,
          name,
          password,
          role,
        },
        {
          onSuccess: () => {
            handleClose()
          },
        },
      )
    },
    [handleClose, updateUser, userId],
  )

  const roleOptions = useMemo(() => {
    const options: BaseOptions[] = [
      { value: EnumRole.VIEWER, label: capitalize(EnumRole.VIEWER) },
      { value: EnumRole.USER, label: capitalize(EnumRole.USER) },
      { value: EnumRole.MANAGER, label: capitalize(EnumRole.MANAGER) },
      { value: EnumRole.ADMIN, label: capitalize(EnumRole.ADMIN) },
    ]
    return options
  }, [])

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
    <Form<UpdateUserFormValues>
      form={form}
      onFinish={onSubmit}
      initialValues={{
        name,
        password,
        role,
      }}
      layout="vertical"
    >
      <Form.Item
        name="name"
        label="Name"
        rules={[
          {
            type: 'string',
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="role" label="Role">
        <Select options={roleOptions} />
      </Form.Item>
    </Form>
  )
}

const UpdateUserModal = () => {
  const formElmRef = useRef<IUpdateUserFormRef>(null)
  const [state, setState] = useContext(UpdateUserCtx)
  const { visible } = state

  const onOk = useCallback(() => {
    formElmRef.current?.submit?.()
  }, [])

  const onCancel = useCallback(() => {
    setState({ visible: false })
  }, [setState])

  return (
    <Modal open={visible} onCancel={onCancel} onOk={onOk} destroyOnClose>
      <UpdateUserForm elmRef={formElmRef} />
    </Modal>
  )
}

export default UpdateUserModal
