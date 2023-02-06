import {
  FormControl,
  InputLabel,
  Theme,
  Select as SelectMui,
  useTheme,
} from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/core'
import React, { CSSProperties, useCallback, useMemo } from 'react'
import { MenuProps } from './MultiSelect'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      // marginTop: 20,
      // marginBottom: 20,
      margin: theme.spacing(1),
      minWidth: 120,
    },
    select: {
      // width: '100%',
      // marginTop: theme.spacing(2),
    },
  }),
)

export const getStyles = (
  current: string,
  selected: string,
  theme: Theme,
): CSSProperties => {
  const isSelected = current === selected
  return {
    fontWeight: isSelected
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
    backgroundColor: isSelected ? 'rgba(100,100,100,0.4)' : undefined,
    padding: 10,
  }
}
export interface SelectProps {
  label: string
  value?: any
  options: BaseOptions[]
  onChange?: (value: string) => void
  disabled?: boolean
}
const Select = (props: SelectProps) => {
  const { label, value, options, disabled, onChange } = props
  const classes = useStyles()
  const theme = useTheme()

  const handleChange = useCallback(
    (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
      const value = event.target.value as string
      onChange?.(value)
    },
    [onChange],
  )

  const selectId = useMemo(() => {
    return `select-${label}`
  }, [label])

  const selectLabelId = useMemo(() => {
    return `${selectId}-label`
  }, [selectId])
  return (
    <FormControl variant="standard" className={classes.formControl}>
      {/* <InputLabel id={selectLabelId}>{label}</InputLabel> */}
      <InputLabel
        htmlFor={selectId}
        style={{ backgroundColor: 'white', paddingRight: 6, paddingLeft: 6 }}
      >
        {label}
      </InputLabel>
      <SelectMui
        labelId={selectLabelId}
        id={selectId}
        className={classes.select}
        // defaultValue={value}
        value={value}
        onChange={handleChange}
        label={label}
        inputProps={{
          name: 'label',
          id: selectId,
        }}
        // MenuProps={MenuProps}
        disabled={disabled || !options.length}
        MenuProps={MenuProps}
      >
        {/* <option aria-label="None" value="" /> */}
        {options.map(({ value: v, label }) => (
          <option key={v} value={v} style={getStyles(v, value, theme)}>
            {label}
          </option>
        ))}
      </SelectMui>
    </FormControl>
  )
}

export default Select
