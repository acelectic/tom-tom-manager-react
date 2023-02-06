import styled from '@emotion/styled'
import { useMemo, useState } from 'react'
import { Field, Form, FormSpy } from 'react-final-form'
import { OnChange } from 'react-final-form-listeners'
import Hidden from '../../components/commons/Hidden'
import Space from '../../components/commons/Space'
import { InputField, RadioField, SelectField } from '../../components/fields'
import { useCreatePayment } from '../../services/payment/payment-query'
import {
  CreatePaymentParams,
  PaymentType,
} from '../../services/payment/payment-types'
import { useGetResources } from '../../services/resource/resource-query'
import { useGetUsers } from '../../services/user/user-query'
import { numberWithCommas } from '../../utils/helper'

const FormLayout = styled.form`
  margin: 20px;

  > button {
    margin-top: 20px;
  }
`

interface CreatePaymentFormValues extends CreatePaymentParams {}

const PaymentForm = () => {
  const { mutate: createPayment } = useCreatePayment()
  const [formValues, setFormValues] = useState<CreatePaymentFormValues>()
  const { data: usersPagination } = useGetUsers()
  const { data: resources } = useGetResources()
  // const { data: transactions } = useGetTransactions({
  //   userId: formValues?.userId,
  // })
  type UsersType = typeof users
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

  const resourcesOption = useMemo(() => {
    return (
      resources?.map(
        ({ id, name }) => ({ value: id, label: name } as BaseOptions),
      ) || []
    )
  }, [resources])

  // const transactionsOption = useMemo(() => {
  //   return (
  //     transactions?.map(
  //       ({ id, ref }) => ({ value: id, label: ref } as BaseOptions),
  //     ) || []
  //   )
  // }, [transactions])

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

  return (
    <Form<CreatePaymentFormValues>
      onSubmit={(values, form) => {
        // alert(JSON.stringify(values))
        createPayment(values, {
          onSuccess: () => {
            form.reset()
          },
        })
      }}
      subscription={{ submitting: true, validating: true }}
    >
      {({ handleSubmit, values, form }) => {
        return (
          <FormLayout>
            <Space direction="column" spacing={5}>
              <InputField name="price" label="Price" required />
              <SelectField name="userId" label="User" options={usersOption} />
              <OnChange name="userId">
                {() => {
                  form.change('transactionId')
                }}
              </OnChange>
              <RadioField
                name="type"
                label="Payment Type"
                options={typeOptions}
              />
              <OnChange name="type">
                {value => {
                  switch (value) {
                    case PaymentType.BUY:
                      if (
                        form.getRegisteredFields().includes('transactionId')
                      ) {
                        form.change('transactionId')
                      }
                      break
                    case PaymentType.PAID:
                      if (form.getRegisteredFields().includes('resourceId')) {
                        form.change('resourceId')
                      }
                      break
                    default:
                      break
                  }
                }}
              </OnChange>
              <Field name="type">
                {({ input }) => {
                  return (
                    <>
                      {/* <Hidden hide={input.value !== PaymentType.PAID}>
                        <SelectField
                          name="transactionId"
                          label="Transaction"
                          options={transactionsOption}
                        />
                      </Hidden> */}
                      <Hidden hide={input.value !== PaymentType.BUY}>
                        <SelectField
                          name="resourceId"
                          label="Resource"
                          options={resourcesOption}
                        />
                      </Hidden>
                    </>
                  )
                }}
              </Field>
              <button type="button" title="button" onClick={handleSubmit}>
                Submit
              </button>
            </Space>
            <FormSpy<CreatePaymentFormValues> subscription={{ values: true }}>
              {({ values }) => {
                setFormValues(values)
                return <></>
              }}
            </FormSpy>
          </FormLayout>
        )
      }}
    </Form>
  )
}

export default PaymentForm
