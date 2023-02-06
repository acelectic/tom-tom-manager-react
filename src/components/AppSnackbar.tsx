import React, { useContext } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import { AppCtx } from '../constant/contexts'
import MuiAlert from '@material-ui/lab/Alert'
import { Typography } from '@material-ui/core'

export type AppSnackbarProps = {
  visible: boolean
  message?: string
  type?: 'error' | 'info' | 'success' | 'warning'
}

export const AppSnackbar = () => {
  const [state, setState, { initialValue }] = useContext(AppCtx)

  const handleClose = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return
    }

    setState({
      appSnackbar: initialValue.appSnackbar,
    })
  }

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={state.appSnackbar.visible}
      autoHideDuration={3000}
      onClose={handleClose}
    >
      <MuiAlert
        onClose={handleClose}
        severity={state.appSnackbar.type}
        variant="filled"
      >
        <Typography>{state.appSnackbar.message}</Typography>
      </MuiAlert>
    </Snackbar>
  )
}
