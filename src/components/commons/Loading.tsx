import { css } from '@emotion/css'
import styled from '@emotion/styled'
import { CircularProgress } from '@material-ui/core'
import { CSSProperties, ReactNode, useEffect, useState } from 'react'

const visible = css`
  transition: opacity 0.3s ease-in-out, top 0.2s ease-in-out;
`
const SpinnerHidden = css`
  transition: opacity 0.25s linear;
`
const LoadingLayout = styled.div`
  position: relative;
  width: 100%;
  min-height: 100px;
`
const LoadingIcon = styled(CircularProgress)<{ loading: string }>`
  position: absolute;
  opacity: ${({ loading }) => (loading === 'true' ? 1 : 0)};
  background-color: transparent;
  font-size: '2.5rem';
  top: calc(50% - 1.3rem);
  left: calc(50% - 1.3rem);
`

type LoadingProps = {
  isLoading: boolean
  children: ReactNode
  style?: CSSProperties
  className?: string
}

const Loading = (props: LoadingProps) => {
  const { isLoading, style, children } = props
  const [localIsLoading, setLocalIsLoading] = useState(isLoading)
  useEffect(() => {
    setTimeout(() => {
      setLocalIsLoading(isLoading)
    }, 400)
  }, [isLoading])
  return (
    <>
      {localIsLoading ? (
        <LoadingLayout style={style}>
          <LoadingIcon
            className={`loading-spinner ${
              localIsLoading ? visible : SpinnerHidden
            }`}
            loading={localIsLoading.toString()}
          />
        </LoadingLayout>
      ) : (
        children
      )}
    </>
  )
}

export default Loading
