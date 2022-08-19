import { HTMLAttributes, useCallback, useState } from 'react'
import { IconType } from 'react-icons/lib'
import {
  VscChromeClose,
  VscChromeMaximize,
  VscChromeMinimize,
} from 'react-icons/vsc'
import styled from 'styled-components'
import { Box } from '~/elements'
import useWindowFocus from '~/hooks/useWindowFocus'

const Container = styled(Box)<{ $focused: boolean }>`
  -webkit-app-region: drag;
  display: flex;
  height: ${({ theme }) => theme.titlebar.height}px;
  justify-content: end;
  font-size: 16px;
  color: ${({ $focused, theme }) =>
    $focused ? 'currentColor' : theme.colors.surface.solidHover};
`

const StyledButton = styled(Box)`
  -webkit-app-region: no-drag;
  width: 54px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    fill: currentColor;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.surface.bgHover};
    color: ${({ theme }) => theme.colors.primary.base};
  }

  &:last-child:hover {
    background: ${({ theme }) => theme.colors.error.text};
  }
`

type ButtonProps = HTMLAttributes<HTMLDivElement> & {
  icon: IconType
}

const Button = ({ icon, ...props }: ButtonProps) => {
  const Icon = icon

  return (
    <StyledButton {...props}>
      <Icon />
    </StyledButton>
  )
}

export default function WindowControls() {
  const isWindowFocused = useWindowFocus()
  const [isMaximized, setIsMaximized] = useState(false)

  const handleMaximize = useCallback(() => {
    if (isMaximized) {
      window.api?.window.unmaximize()
    } else {
      window.api?.window.maximize()
    }

    setIsMaximized(!isMaximized)
  }, [isMaximized])

  return (
    <Container $focused={isWindowFocused}>
      <Button icon={VscChromeMinimize} onClick={window.api?.window.minimize} />
      <Button icon={VscChromeMaximize} onClick={handleMaximize} />
      <Button icon={VscChromeClose} onClick={window.api?.window.close} />
    </Container>
  )
}
