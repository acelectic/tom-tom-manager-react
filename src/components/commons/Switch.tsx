import { Switch as AntdSwitch } from 'antd'

export interface SwitchProps {
  labelActive?: string
  labelInActive?: string
  value?: boolean
  onChange?: (value: boolean) => void
  isLoading?: boolean
}
const Switch = (props: SwitchProps) => {
  const {
    value = false,
    labelActive = 'Active',
    labelInActive = 'Inactive',
    onChange,
    isLoading,
  } = props

  return (
    <AntdSwitch
      checked={value}
      checkedChildren={labelActive}
      unCheckedChildren={labelInActive}
      loading={isLoading}
      onChange={onChange}
    />
  )
}

export default Switch
