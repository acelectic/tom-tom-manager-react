import styled from '@emotion/styled'
import {
  Grid,
  GridContentAlignment,
  GridDirection,
  GridItemsAlignment,
  GridJustification,
} from '@material-ui/core'
import { CSSProperties } from '@material-ui/styles'
import { flatten } from 'lodash'

interface LayoutType {
  direction?: GridDirection
  spacing?: number
  justify?: GridJustification
  alignItem?: GridItemsAlignment
  alignContent?: GridContentAlignment
}

const Layout = styled.div<LayoutType>`
  display: flex;
  flex: 1;
  width: 100%;
  flex-flow: ${({ direction }) => direction};
  justify-content: ${({ justify }) => justify};
  align-items: ${({ alignItem }) => alignItem};
  align-content: ${({ alignContent }) => alignContent};

  > .space-item {
    width: 100%;
    min-width: max-content;
    ${({ direction, spacing }) =>
      direction === 'row'
        ? `margin-right: ${spacing}px`
        : `margin-bottom: ${spacing}px`};

    :last-of-type {
      margin-right: 0;
      margin-bottom: 0;
    }
  }
`

interface SpaceProps extends LayoutType {
  children: JSX.Element[] | JSX.Element
  style?: CSSProperties
}
const Space = (props: SpaceProps) => {
  const {
    direction = 'row',
    spacing = 20,
    alignContent,
    alignItem,
    justify,
    children,
    style,
  } = props

  return (
    <Layout
      className="space-warpper"
      direction={direction}
      spacing={spacing}
      alignContent={alignContent}
      alignItem={alignItem}
      justify={justify}
      style={style}
    >
      {flatten([children]).map((elm, index) => {
        return (
          <div key={index} className="space-item">
            {elm}
          </div>
        )
      })}
      <Grid></Grid>
    </Layout>
  )
}

export default Space
