import styled from '@emotion/styled'
import { PropsWithChildren } from 'react'

const Layout = styled.div<{ hide?: boolean }>`
  /* display: ${({ hide }) => (hide ? 'none' : 'unset')}; */
`

interface HiddenProps {
  hide?: boolean
}
const Hidden = (props: PropsWithChildren<HiddenProps>) => {
  return <Layout hidden={props.hide}>{props.children}</Layout>
}

export default Hidden
