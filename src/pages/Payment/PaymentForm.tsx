import { useMemo } from 'react'
import { useCreatePayment } from '../../services/payment/payment-query'
import {
  CreatePaymentParams,
  PaymentType,
} from '../../services/payment/payment-types'
import { useGetResources } from '../../services/resource/resource-query'
import { useGetUsers } from '../../services/user/user-query'
import { numberWithCommas } from '../../utils/helper'
import { Button, Col, Form, Radio, Select } from 'antd'
import { useGetTransactions } from '../../services/transaction/transaction-query'
import { chain } from 'lodash'
import InputNumber from '../../components/commons/InputNumber'

interface CreatePaymentFormValues extends CreatePaymentParams {}

const PaymentForm = () => {
  const [form] = Form.useForm<CreatePaymentFormValues>()
  const userId = Form.useWatch('userId', form)
  const type = Form.useWatch('type', form)

  const { mutate: createPayment } = useCreatePayment()
  const { data: usersPagination } = useGetUsers()
  const { data: resources } = useGetResources()
  const { data: transactions } = useGetTransactions({
    userId,
  })

  const users = useMemo(
    () =>
      usersPagination
        ? usersPagination?.items.map((d) => ({
            ...d,
            balance: numberWithCommas(d.balance),
          }))
        : [],
    [usersPagination],
  )

  const usersOption = useMemo(() => {
    return (
      users?.map(
        ({ id, name }) => ({ value: id, label: name } as BaseOptions),
      ) || []
    )
  }, [users])

  const resourcesOption = useMemo(() => {
    return (
      resources?.map(
        ({ id, name }) => ({ value: id, label: name } as BaseOptions),
      ) || []
    )
  }, [resources])

  const transactionsOption = useMemo(() => {
    return chain(transactions?.items || [])
      .map(({ id, ref }): BaseOptions => ({ value: id, label: ref.toString() }))
      .value()
  }, [transactions])

  const typeOptions = useMemo(
    (): BaseOptions[] => [
      {
        value: PaymentType.BUY,
        label: PaymentType.BUY,
      },
      {
        value: PaymentType.PAID,
        label: PaymentType.PAID,
      },
    ],
    [],
  )

  const initialValues = useMemo((): DeepPartial<CreatePaymentFormValues> => {
    return {
      type: PaymentType.BUY,
    }
  }, [])

  return (
    <Form
      form={form}
      initialValues={initialValues}
      onFinish={(values) => {
        alert(JSON.stringify(values))
        createPayment(values, {
          onSuccess: () => {
            form.resetFields()
          },
        })
      }}
    >
      <Col>
        <Form.Item
          name="price"
          label="Price"
          rules={[
            {
              type: 'number',
              required: true,
              min: 1,
              max: 10000,
            },
          ]}
          // help="min: 1, max: 10,000"
        >
          <InputNumber allowNegative={false} />
        </Form.Item>
        <Form.Item
          name="userId"
          label="User"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select options={usersOption} />
        </Form.Item>
        <Form.Item
          name="type"
          label="Payment Type"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Radio.Group options={typeOptions} />
        </Form.Item>

        {type === PaymentType.PAID ? (
          <Form.Item
            name="transactionId"
            label="Transaction"
            dependencies={['type']}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select options={transactionsOption} />
          </Form.Item>
        ) : (
          <Form.Item
            name="resourceId"
            label="Resource"
            dependencies={['type']}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select options={resourcesOption} />
          </Form.Item>
        )}

        <Button htmlType="submit" type="primary">
          Submit
        </Button>
      </Col>
    </Form>
  )
}

export default PaymentForm
