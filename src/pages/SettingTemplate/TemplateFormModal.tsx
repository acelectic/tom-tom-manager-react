import { chain, sumBy } from 'lodash'
import {
  Ref,
  useCallback,
  useContext,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'
import Text from '../../components/commons/Text'
import { TemplateFormCtx } from '../../constant/contexts'
import { useGetResources } from '../../services/resource/resource-query'
import { TemplateEntity } from '../../services/template/template-types'
import { Col, Form, Input, Modal, Select } from 'antd'
import Switch from '../../components/commons/Switch'

export interface ITemplateFormValues
  extends Omit<TemplateEntity, 'resources' | 'id'> {
  resourceIds: string[]
  id?: string
}

interface ITemplateFormRef {
  submit: () => void
}

interface TemplateFormProps {
  onSubmit: (values: ITemplateFormValues) => void
  elmRef?: Ref<ITemplateFormRef>
}
const TemplateForm = (props: TemplateFormProps) => {
  const { onSubmit, elmRef } = props

  const [form] = Form.useForm<ITemplateFormValues>()

  const [state, , { reset }] = useContext(TemplateFormCtx)
  const { id, name, description, isActive = true, resourceIds = [] } = state
  const { data: resources = [] } = useGetResources()

  const handleClose = useCallback(() => {
    reset()
  }, [reset])

  const resourcesOption = useMemo(() => {
    return chain(resources)
      .filter(({ id, isActive }) => isActive || resourceIds?.includes(id))
      .map(
        ({ id, name, price }): BaseOptions => ({
          value: id,
          label: `${name}: ${price}`,
        }),
      )
      .value()
  }, [resourceIds, resources])

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
    <Form<ITemplateFormValues>
      form={form}
      onFinish={values => {
        onSubmit({ ...values, id })
        handleClose()
      }}
      initialValues={{
        id,
        name,
        description,
        isActive,
        resourceIds,
      }}
    >
      <Col>
        <Col>
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
        </Col>
        <Col>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              {
                type: 'string',
                required: false,
              },
            ]}
          >
            <Input.TextArea
              className="no-resize"
              rows={5}
              maxLength={1500}
              showCount
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name="isActive">
            <Switch />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            name="resourceIds"
            label="Resource"
            rules={[
              {
                validator: (rule, value) => {
                  if (!value.length) {
                    return Promise.reject('Select at least one option')
                  }
                  return Promise.resolve()
                },
              },
            ]}
          >
            <Select options={resourcesOption} mode="tags" />
          </Form.Item>
        </Col>

        <Col>
          <Form.Item shouldUpdate>
            {() => {
              const values = form.getFieldsValue()
              const { resourceIds = [] } = values || {}
              const selectedResources = resources?.filter(({ id }) =>
                resourceIds.includes(id),
              )
              const cost = sumBy(selectedResources, ({ price }) =>
                Number(price),
              )
              return <Text>{`Total price: ${cost}`}</Text>
            }}
          </Form.Item>
        </Col>
      </Col>
    </Form>
  )
}

interface ITemplateFormModalProps extends TemplateFormProps {}
const TemplateFormModal = (props: ITemplateFormModalProps) => {
  const { onSubmit } = props
  const formElmRef = useRef<ITemplateFormRef>(null)
  const [state, setState] = useContext(TemplateFormCtx)
  const { visible } = state

  const onOk = useCallback(() => {
    formElmRef.current?.submit?.()
  }, [])

  const onCancel = useCallback(() => {
    setState({ visible: false })
  }, [setState])

  return (
    <Modal open={visible} onCancel={onCancel} onOk={onOk} destroyOnClose>
      <TemplateForm onSubmit={onSubmit} elmRef={formElmRef} />
    </Modal>
  )
}

export default TemplateFormModal
