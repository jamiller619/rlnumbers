import { Alert, AlertOwnProps } from 'evergreen-ui'
import { ReactElement, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

type ToastProps = AlertOwnProps & {
  children: ReactElement | null
  wait: number
}

const AlertContainer = styled(Alert)<{ $visible: boolean }>`
  opacity: ${({ $visible: visible }) => (visible ? 1 : 0)};
  transform: translateY(${({ $visible: visible }) => (visible ? 0 : '-100%')});
  transition-property: transform, opacity;
  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
`

export default function Toast({
  children = null,
  wait: duration = 5,
  ...props
}: ToastProps): JSX.Element {
  const [content, setContent] = useState(children)
  const [visible, setVisible] = useState(children != null)
  const timer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setContent(children)

    if (timer.current) {
      clearTimeout(timer.current)
    }

    timer.current = setTimeout(() => {
      setVisible(false)
    }, duration * 1000)

    return () => void (timer.current && clearTimeout(timer.current))
  }, [children, duration])

  return (
    <AlertContainer {...props} $visible={visible}>
      {content}
    </AlertContainer>
  )
}
