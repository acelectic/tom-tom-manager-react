import DatePicker, { DatePickerProps } from '../commons/DatePicker'
import Input, { InputProps } from '../commons/Input'
import MultiSelect, { MultiSelectProps } from '../commons/MultiSelect'
import Radio, { RadioProps } from '../commons/Radio'
import Select, { SelectProps } from '../commons/Select'
import Switch, { SwitchProps } from '../commons/Switch'
import { makeField } from './tools'

export const InputField = makeField<InputProps>(Input)
export const MultiSelectField = makeField<MultiSelectProps>(MultiSelect)
export const SelectField = makeField<SelectProps>(Select)
export const RadioField = makeField<RadioProps>(Radio)
export const SwitchField = makeField<SwitchProps>(Switch)
export const DatePickerField = makeField<DatePickerProps>(DatePicker)
