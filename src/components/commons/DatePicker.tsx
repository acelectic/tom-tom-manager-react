import React, { useCallback, useState } from 'react'
import DateFnsUtils from '@date-io/dayjs' // choose your lib
import {
  DatePicker as DatePickerMui,
  TimePicker,
  DateTimePicker,
  MuiPickersUtilsProvider,
  BaseDatePickerProps,
  DatePickerProps as DatePickerMuiProps,
} from '@material-ui/pickers'
import dayjs, { Dayjs } from 'dayjs'
import { Typography } from '@material-ui/core'

export interface DatePickerProps
  extends Omit<DatePickerMuiProps, 'value' | 'onChange'> {
  label: string
  value?: Dayjs
  onChange?: (date: Dayjs) => void
}
const DatePicker = (props: DatePickerProps) => {
  const { label, value, onChange, ...restProps } = props
  const handleDateChange = useCallback(
    (date: Parameters<DatePickerMuiProps['onChange']>['0']) => {
      date && onChange?.(dayjs(date))
    },
    [onChange],
  )
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <DatePickerMui
        label={label}
        value={dayjs(value)}
        onChange={handleDateChange}
        {...restProps}
      />
    </MuiPickersUtilsProvider>
  )
}

export default DatePicker
