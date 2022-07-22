import { Pane } from 'evergreen-ui'
import {
  HTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import styled from 'styled-components'
import { SmallText } from '~/components'

type ProgressBarProps = HTMLAttributes<HTMLProgressElement> & {
  namespace?: string
}

const ProgressElement = styled.progress`
  width: 100%;
  height: 6px;
  flex: 1;
  margin-right: 2rem;
`

const Container = styled(Pane).attrs({
  display: 'flex',
  alignItems: 'center',
})``

export default function ProgressBar({
  namespace,
  ...props
}: ProgressBarProps): JSX.Element | null {
  const total = useRef(0)
  const isInProgress = useRef(true)
  const [progress, setProgress] = useState(0)

  const pre = `${namespace ? `${namespace}:` : ''}`
  const evtns = useCallback(
    (eventName: string) => {
      return `${pre}${eventName}`
    },
    [pre]
  )

  const handlers = useMemo(
    () => ({
      start: (_: unknown, newTotal: number) => {
        total.current = newTotal
        setProgress(0)
      },
      progress: (_: unknown, pct: number, newTotal: number) => {
        total.current = newTotal
        setProgress(pct)
      },
      end: () => {
        total.current = 0
        setProgress(0)
      },
    }),
    []
  )

  useEffect(() => {
    window.api?.on(evtns('start'), handlers.start)
    window.api?.on(evtns('progress'), handlers.progress)
    window.api?.on(evtns('end'), handlers.end)

    return () => {
      window.api?.off(evtns('start'), handlers.start)
      window.api?.off(evtns('progress'), handlers.progress)
      window.api?.off(evtns('end'), handlers.end)
    }
  }, [evtns, handlers])

  return isInProgress ? (
    <Container>
      <ProgressElement {...props} value={progress} max="100" />
      <SmallText>
        {progress}% of {total.current}
      </SmallText>
    </Container>
  ) : null
}
