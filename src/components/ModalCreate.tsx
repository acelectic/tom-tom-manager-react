import { capitalize } from 'lodash'
import { Ref, useCallback, useImperativeHandle, useRef } from 'react'
import { Input, Modal, Form } from 'antd'

interface IModalCreateFormRef {
  submit: () => void
}

export interface ModalCreateFormProps<T extends AnyObject, K extends keyof T> {
  fieldNames: K[]
  onSubmit: (values: T) => void
  elmRef: Ref<IModalCreateFormRef>
}
const ModalCreateFrom = <T extends AnyObject, K extends keyof T = keyof T>(
  props: ModalCreateFormProps<T, K>,
) => {
  const { fieldNames, onSubmit, elmRef } = props
  const [form] = Form.useForm()

  const renderField = useCallback((fieldName: K) => {
    const temp = fieldName as string
    return (
      <Form.Item
        key={temp}
        label={capitalize(temp)}
        name={temp}
        rules={[
          {
            type: 'string',
            required: true,
          },
        ]}
        required={true}
      >
        <Input placeholder={capitalize(temp)} />
      </Form.Item>
    )
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
    <div className={`content`}>
      <Form<T>
        form={form}
        initialValues={{}}
        onFinish={onSubmit}
        layout="vertical"
      >
        <div>{fieldNames.map(renderField)}</div>
      </Form>
    </div>
  )
}

export interface ModalCreateProps<T extends AnyObject, K extends keyof T> {
  visible: boolean
  fieldNames: K[]
  onSubmit: (values: T) => Promise<void>
  closeModal: () => void
  className?: string
}
const ModalCreate = <T extends AnyObject, K extends keyof T = keyof T>(
  props: ModalCreateProps<T, K>,
) => {
  const { visible, className, fieldNames, onSubmit, closeModal } = props
  const formElmRef = useRef<IModalCreateFormRef>(null)

  const onOk = useCallback(() => {
    formElmRef.current?.submit?.()
  }, [])

  const onCancel = useCallback(() => {
    closeModal()
  }, [closeModal])

  return (
    <Modal open={visible} className={className} onOk={onOk} onCancel={onCancel}>
      <ModalCreateFrom
        fieldNames={fieldNames}
        onSubmit={onSubmit}
        elmRef={formElmRef}
      />
    </Modal>
  )
}

export default ModalCreate
