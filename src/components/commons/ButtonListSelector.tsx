import { useCallback, useState } from 'react'
import styled from '@emotion/styled'

const ButtonListSelectorLayout = styled.div`
  display: flex;
  position: relative;
  flex-flow: row;
  width: 100%;
`
const ContentScroll = styled.div`
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  flex-grow: 1;
  overflow: auto;
  display: flex;
  flex-flow: row nowrap;
`

const ButtonSelectorStyle = styled.button`
  color: white;
  border: none;
  height: 30px;
  margin: 2px;
  flex-grow: 1;
  flex-shrink: 120px;
`

interface ButtonListSelectorProps {
  options: {
    key: string
    value: number | string
  }[]
  onSelect?: (value: number | string) => void
  buttonColor?: string
  toggle?: boolean
}

const ButtonSelector = (props: ButtonListSelectorProps) => {
  const { options, onSelect, buttonColor = 'rgb(30, 30, 120)', toggle } = props
  const [selected, setSelected] = useState(null)
  const onButtonClick = useCallback(
    (index) => () => {
      setSelected(index)
      onSelect && onSelect(index)
    },
    [onSelect],
  )
  return (
    <ButtonListSelectorLayout>
      <ContentScroll>
        {options.map(({ key, value }, index: number) => {
          return (
            <ButtonSelectorStyle
              key={key}
              value={value}
              onClick={onButtonClick(index)}
              style={{
                backgroundColor: buttonColor,
                opacity: (index === selected && !toggle) || toggle ? 1 : 0.5,
              }}
            >
              {value}
            </ButtonSelectorStyle>
          )
        })}
      </ContentScroll>
    </ButtonListSelectorLayout>
  )
}
export default ButtonSelector
