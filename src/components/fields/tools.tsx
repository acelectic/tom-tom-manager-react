// import { makeStyles } from '@material-ui/core'
// import { CSSProperties } from '@material-ui/styles'
// import dayjs from 'dayjs'
// import { AnyObject } from 'final-form'
// import { ComponentType, useMemo } from 'react'
import { FieldProps, FieldRenderProps } from 'react-final-form'
import { Field as FieldFinalForm } from 'react-final-form'
// import Text from '../../components/common/Text'

import { ComponentType, CSSProperties, useMemo } from 'react'
import Text from '../commons/Text'
import { without } from 'lodash'

interface BaseFieldProps extends AnyObject {
  style?: CSSProperties
  className?: string
}

export const modifyComponent = <T extends unknown>(
  Component: ComponentType<any>,
) => (props: FieldRenderProps<T> & BaseFieldProps) => {
  const { input, meta, style, className, ...restProps } = props
  const { error, touched } = meta
  const isError = useMemo(() => {
    return error && touched
  }, [error, touched])
  const classNames = useMemo(() => {
    const temp = ['field-wrapper', className]
    return without(temp, '', null, undefined).join(' ')
  }, [className])

  return (
    <div className={classNames} style={style}>
      <Component {...input} {...restProps} />
      {isError && (
        <Text color={'red'} size={12}>
          {meta.error}
        </Text>
      )}
    </div>
  )
}

export const makeField = <T extends BaseFieldProps>(
  component: ComponentType<any>,
) => {
  const newComponent = modifyComponent<T>(component)
  const returnField = (
    props: FieldProps<string, FieldRenderProps<string>> & T,
  ) => <FieldFinalForm {...props} render={newComponent} />
  return returnField
}
