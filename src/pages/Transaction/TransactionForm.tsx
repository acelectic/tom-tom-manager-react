import { ceil, keyBy, sumBy } from 'lodash'
import { useMemo } from 'react'
import Text from '../../components/commons/Text'
import { useGetTemplates } from '../../services/template/template-query'
import { useCreateTransaction } from '../../services/transaction/transaction-query'
import { CreateTransactionParams } from '../../services/transaction/transaction-types'
import { useGetUsers } from '../../services/user/user-query'
import { numberWithCommas } from '../../utils/helper'
import { Button, Col, Form, Modal, Row, Select, Tag, Typography } from 'antd'
import { useTranslation } from 'react-i18next'

interface CreateTransactionFormValues extends CreateTransactionParams {}

const TransactionForm = () => {
  const [form] = Form.useForm<CreateTransactionFormValues>()
  const templateId = Form.useWatch('templateId', form)
  const userIds = Form.useWatch('userIds', form)

  const { t } = useTranslation()
  const { mutate: createTransaction } = useCreateTransaction()
  const { data: usersPagination } = useGetUsers()
  const { data: templates } = useGetTemplates({
    isActive: true,
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

  const usersHash = useMemo(() => {
    return keyBy(users, 'id')
  }, [users])

  const usersOption = useMemo(() => {
    return (
      users?.map(({ id, name }): BaseOptions => ({ value: id, label: name })) ||
      []
    )
  }, [users])

  const templatesOption = useMemo(() => {
    return (
      templates?.map(
        ({ id, ref, name, cost }): BaseOptions => ({
          value: id,
          label: `${ref}: ${name} | cost = ${numberWithCommas(cost)}`,
        }),
      ) || []
    )
  }, [templates])

  const templateSelected = useMemo(
    () => templates?.find(({ id }) => id === templateId),
    [templateId, templates],
  )
  const sumPrice = useMemo(
    () => sumBy(templateSelected?.resources, 'price'),
    [templateSelected?.resources],
  )

  return (
    <Form
      form={form}
      onFinish={(values) => {
        Modal.confirm({
          title: t('Confirm Create Transaction'),
          content: (
            <Row gutter={[12, 12]}>
              <Col>
                <Typography>Template: {templateSelected?.ref}</Typography>
              </Col>
              <Col>
                <Typography>
                  Price per User:{' '}
                  {`${numberWithCommas(ceil(sumPrice / userIds.length))}`}
                </Typography>
              </Col>
              <Col span={24}></Col>
              {userIds.map((userId) => (
                <Col key={userId}>
                  <Tag color="default">{usersHash[userId].name}</Tag>
                </Col>
              ))}
            </Row>
          ),
          onOk: () => {
            createTransaction(values)
          },
        })
      }}
      initialValues={{
        userIds: [],
        templateId: templates?.length ? templates[0].id : '',
      }}
      layout="vertical"
    >
      <Row gutter={[24, 24]}>
        <Col span={8}>
          <Form.Item
            name="templateId"
            label="Template"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select options={templatesOption} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="userIds"
            label="User"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select options={usersOption} mode="tags" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item shouldUpdate>
            {() => {
              return templateSelected ? (
                <Row gutter={[16, 16]}>
                  <Col>
                    <Text>
                      Template:{' '}
                      {`${templateSelected?.ref}: ${numberWithCommas(
                        sumPrice,
                      )}`}
                    </Text>
                  </Col>
                  <Col>
                    {userIds?.length ? (
                      <Text>
                        Price per User:{' '}
                        {`${numberWithCommas(ceil(sumPrice / userIds.length))}`}
                      </Text>
                    ) : null}
                  </Col>
                </Row>
              ) : null
            }}
          </Form.Item>
        </Col>
        <Col span={4}>
          <Button type="primary" htmlType="submit" block>
            Submit
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

export default TransactionForm
