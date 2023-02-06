import React, { useCallback } from 'react'
import RadioMui from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'

export interface RadioProps {
  label: string
  options: BaseOptions[]
  value?: any
  onChange?: (value: any) => void
}
const Radio = (props: RadioProps) => {
  const { label, value, options, onChange } = props

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.((event.target as HTMLInputElement).value)
    },
    [onChange],
  )
  const renderRadio = useCallback((option: BaseOptions) => {
    return (
      <FormControlLabel
        key={option.value}
        value={option.value}
        control={<RadioMui />}
        label={option.label}
      />
    )
  }, [])

  return (
    <FormControl
      component="fieldset"
      style={{ marginTop: 20, marginBottom: 20 }}
    >
      <FormLabel component="legend">{label}</FormLabel>
      <RadioGroup
        aria-label="gender"
        name="gender1"
        value={value}
        onChange={handleChange}
      >
        {options.map(renderRadio)}
      </RadioGroup>
    </FormControl>
  )
}

export default Radio
