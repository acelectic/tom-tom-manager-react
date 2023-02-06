import styled from '@emotion/styled'
import { CSSProperties, ReactNode } from 'react'

const StyledText = styled.div<{
  weight: number
  size: number
  color: string
}>`
  font-family: 'Kanit', sans-serif;
  font-weight: ${({ weight }) => weight};
  font-size: ${({ size }) => size / 16}rem;
  color: ${({ color }) => color};
  display: flex;

  white-space: pre-wrap;
  word-break: break-word;
`

export type TextProps = {
  children?: ReactNode
  size?: number
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
  className?: string
  color?: string
  style?: CSSProperties
  wrap?: boolean
}

const Text = (props: TextProps) => {
  const {
    children,
    size = 17,
    weight = 400,
    className,
    color = '#000000',
    style,
    wrap = true,
    ...restProps
  } = props
  return (
    <StyledText
      size={size}
      weight={weight}
      className={wrap ? `${className}` : className}
      color={color}
      style={style}
      {...restProps}
    >
      {children}
    </StyledText>
  )
}

export default Text
