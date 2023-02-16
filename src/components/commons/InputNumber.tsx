import { Input, InputProps } from 'antd'
import { isNumber } from 'lodash'
import { useCallback } from 'react'
import {
  NumericFormat,
  NumericFormatProps,
  NumberFormatValues,
} from 'react-number-format'

type IInputNumberProps = Omit<
  NumericFormatProps,
  'customInput' | 'size' | 'onValueChange' | 'onChange'
> &
  Omit<InputProps, 'onChange'> & {
    onChange?: (value?: number) => void
  }

interface IIsAllowedOptions {
  min?: number
  max?: number
}

const InputNumber = (props: IInputNumberProps) => {
  const { value, onChange, ...restProps } = props

  const handleChange = useCallback(
    (values: NumberFormatValues) => {
      onChange?.(values.floatValue)
    },
    [onChange],
  )

  return (
    <NumericFormat
      thousandSeparator=","
      decimalSeparator="."
      decimalScale={2}
      {...restProps}
      onValueChange={handleChange}
      customInput={Input}
    />
  )
}

InputNumber.makeIsAllowed =
  (options: IIsAllowedOptions) =>
  (value: NumberFormatValues): boolean => {
    const { min, max } = options
    const { floatValue } = value

    if (isNumber(min) && floatValue !== undefined && floatValue < min) {
      return false
    }
    if (isNumber(max) && floatValue !== undefined && floatValue > max) {
      return false
    }

    return true
  }

export default InputNumber
