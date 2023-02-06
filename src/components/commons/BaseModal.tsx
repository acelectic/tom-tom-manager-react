import { makeStyles, Modal } from '@material-ui/core'
import { capitalize } from 'lodash'
import { PropsWithChildren, useCallback } from 'react'
import { Form } from 'react-final-form'
import { InputField } from '../fields'

export const useAppModalStyles = makeStyles({
  appModal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  layout: {
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    background: '#FFFFFF',
    padding: '2.188rem',
    borderRadius: '1.25rem',
    '&:focus': {
      outline: 'unset',
    },
  },
  header: {
    marginBottom: '0.625rem',
    textAlign: 'left',
  },
  closeIcon: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
  },
  body: {
    marginBottom: '1.625rem',
    textAlign: 'center',
  },
  footer: {
    display: 'flex',
    justifyContent: 'center',
    '& > *:first-of-type(1)': {
      marginRight: '0.625rem',
    },
  },
})

export interface BaseModalProps {
  visible: boolean
  closeModal: () => void
  className?: string
}
const BaseModal = (props: PropsWithChildren<BaseModalProps>) => {
  const { visible, className, children, closeModal } = props

  const classes = useAppModalStyles()

  return (
    <Modal
      open={visible}
      className={`${classes.appModal}`}
      aria-labelledby="app-modal-title"
      aria-describedby="app-modal-description"
      disablePortal
      disableEnforceFocus
      disableAutoFocus
      disableRestoreFocus
      onBackdropClick={closeModal}
    >
      <div className={`content ${classes.layout} ${className}`}>{children}</div>
    </Modal>
  )
}

export default BaseModal
