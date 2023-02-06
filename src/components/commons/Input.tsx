import { Box, TextField, TextFieldProps } from '@material-ui/core'

export type InputProps = TextFieldProps

export const Input = (props: InputProps) => {
  const { disabled = false, ...restProps } = props

  return (
    <Box style={{ marginTop: 20, marginBottom: 20 }}>
      <TextField variant="outlined" disabled={disabled} {...restProps} />
    </Box>
  )
}
export default Input
