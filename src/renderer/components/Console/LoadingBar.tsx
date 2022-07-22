import { Pane } from 'evergreen-ui'
import { HTMLAttributes, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { SmallText } from '~/components'

type LoadingBarProps = HTMLAttributes<HTMLProgressElement>

const ProgressBar = styled.progress`
  width: 100%;
  height: 6px;
  flex: 1;
  margin-right: 2rem;
`

const Container = styled(Pane).attrs({
  display: 'flex',
  alignItems: 'center',
})``

export default function LoadingBar(props: LoadingBarProps): JSX.Element | null {
  const [total, setTotal] = useState<number | null>(null)
  const [progress, setProgress] = useState(0)
  const isImporting = useMemo(() => progress > 0, [progress])

  const importHandlers = useMemo(() => {
    const handleStart = (_: unknown, val: number) => {
      setTotal(val)
      setProgress(0)
    }

    const handleProgress = (_: unknown, pct: number, apiTotal: number) => {
      setProgress(pct)

      if (total != apiTotal) {
        setTotal(apiTotal)
      }
    }

    const handleEnd = () => {
      setTotal(0)
      setProgress(0)
    }

    return {
      start: handleStart,
      progress: handleProgress,
      end: handleEnd,
    }
  }, [total])

  useEffect(() => {
    window.api?.on('import:start', importHandlers.start)
    window.api?.on('import:progress', importHandlers.progress)
    window.api?.on('import:end', importHandlers.end)

    return () => {
      window.api?.off('import:start', importHandlers.start)
      window.api?.off('import:progress', importHandlers.progress)
      window.api?.off('import:end', importHandlers.end)
    }
  }, [importHandlers])

  return isImporting ? (
    <Container>
      <ProgressBar {...props} value={progress} max="100" />
      <SmallText>
        {progress}% of {total}
      </SmallText>
    </Container>
  ) : null
}
