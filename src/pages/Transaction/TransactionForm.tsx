import styled from '@emotion/styled'
import { ceil, sumBy } from 'lodash'
import { useMemo } from 'react'
import { Form, FormSpy } from 'react-final-form'
import Space from '../../components/commons/Space'
import Text from '../../components/commons/Text'
import { MultiSelectField, SelectField } from '../../components/fields'
import { useGetTemplates } from '../../services/template/template-query'
import { useCreateTransaction } from '../../services/transaction/transaction-query'
import { CreateTransactionParams } from '../../services/transaction/transaction-types'
import { useGetUsers } from '../../services/user/user-query'
import { numberWithCommas } from '../../utils/helper'

const FormLayout = styled.form`
  margin: 20px;

  > button {
    margin-top: 20px;
  }
`

interface CreateTransactionFormValues extends CreateTransactionParams {}

const TransactionForm = () => {
  const { mutate: createTransaction } = useCreateTransaction()
  const { data: usersPagination } = useGetUsers()
  const { data: templates } = useGetTemplates({
    isActive: true,
  })

  const users = useMemo(
    () =>
      usersPagination
        ? usersPagination?.items.map(d => ({
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

  return (
    <Form<CreateTransactionFormValues>
      onSubmit={values => {
        createTransaction(values)
      }}
      initialValues={{
        userIds: [],
        templateId: templates?.length ? templates[0].id : '',
      }}
    >
      {({ handleSubmit }) => {
        return (
          <FormLayout>
            <SelectField
              name="templateId"
              label="Template"
              options={templatesOption}
            />
            <MultiSelectField
              name="userIds"
              label="User"
              options={usersOption}
              required
            />
            <FormSpy<CreateTransactionFormValues>>
              {({ values }) => {
                const { templateId, userIds } = values
                const templateSelected = templates?.find(
                  ({ id }) => id === templateId,
                )
                const sumPrice = sumBy(templateSelected?.resources, 'price')

                return templateSelected ? (
                  <Space
                    direction="column"
                    spacing={10}
                    style={{ marginTop: 40 }}
                  >
                    <Text>
                      Template:{' '}
                      {`${templateSelected?.ref}: ${numberWithCommas(
                        sumPrice,
                      )}`}
                    </Text>
                    <>
                      {userIds?.length ? (
                        <Text>
                          Price per User: {`${ceil(sumPrice / userIds.length)}`}
                        </Text>
                      ) : null}
                    </>
                  </Space>
                ) : null
              }}
            </FormSpy>
            <button type="button" title="button" onClick={handleSubmit}>
              Submit
            </button>
          </FormLayout>
        )
      }}
    </Form>
  )
}

export default TransactionForm
