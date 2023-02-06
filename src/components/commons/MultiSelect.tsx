import { MenuProps as MenuPropsType } from '@material-ui/core'
import { Select as AntdSelect, Form, SelectProps } from 'antd'
import { useCallback } from 'react'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
export const MenuProps: Partial<MenuPropsType> = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

export interface MultiSelectProps
  extends Omit<SelectProps, 'value' | 'onChange' | 'mode'> {
  label: string
  value?: string[]
  onChange?: (values: string[]) => void
}
const MultiSelect = (props: MultiSelectProps) => {
  const { label, value = [], options, onChange, ...restProps } = props

  const handleChange = useCallback(
    (values: string[]) => {
      onChange?.(values)
    },
    [onChange],
  )

  return (
    <Form.Item label={label} labelCol={{ span: 24 }}>
      <AntdSelect
        value={value}
        onChange={handleChange}
        options={options}
        mode="tags"
        {...restProps}
      />
    </Form.Item>
  )
}

export default MultiSelect
