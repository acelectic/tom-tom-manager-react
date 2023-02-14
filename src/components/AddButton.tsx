import styled from '@emotion/styled'
import { Button } from '@material-ui/core'
import { useCallback, useState } from 'react'
import ModalCreate, { ModalCreateProps } from './ModalCreate'

const Layout = styled.div``

interface AddButtonProps<T extends AnyObject, K extends keyof T>
  extends Omit<ModalCreateProps<T, K>, 'visible' | 'closeModal'> {
  name: string
}
const AddButton = <T extends AnyObject, K extends keyof T = keyof T>(
  props: AddButtonProps<T, K>,
) => {
  const { name, fieldNames, onSubmit } = props
  const [visible, setVisible] = useState(false)

  const openModal = useCallback(() => {
    setVisible(true)
  }, [])

  const closeModal = useCallback(() => {
    setVisible(false)
  }, [])

  const onModalSubmit = useCallback(
    async (values: T) => {
      try {
        await onSubmit(values)
      } catch (error) {
        return Promise.reject(error)
      } finally {
        closeModal()
      }
    },
    [closeModal, onSubmit],
  )
  return (
    <Layout>
      <Button variant="outlined" color="primary" onClick={openModal}>
        {name}
      </Button>
      <ModalCreate
        visible={visible}
        fieldNames={fieldNames}
        onSubmit={onModalSubmit}
        closeModal={closeModal}
      />
    </Layout>
  )
}

export default AddButton
