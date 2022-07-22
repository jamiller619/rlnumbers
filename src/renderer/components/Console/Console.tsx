import chalk from 'chalk'
import Color from 'color'
import { HTMLAttributes, useCallback, useEffect, useMemo, useRef } from 'react'
import styled, { useTheme } from 'styled-components'
import { ITerminalOptions } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { XTerm } from 'xterm-for-react'
import Xterm from 'xterm-for-react/dist/src/XTerm'
import LoadingBar from './LoadingBar'

type ConsoleProps = HTMLAttributes<HTMLDivElement> & {
  onSizeChange: (size: string) => void
}

const timeStampFormatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
})

const termStyle = {
  fontFamily: '"SF Mono", monospace',
  fontSize: 12,
}

const prefix = () => {
  const timestamp = timeStampFormatter.format(new Date())

  return `${chalk.gray(timestamp)} ${chalk.cyanBright('›')}`
}

const format = (str: string) => {
  // double quotes
  const dq = str.match(/(?:"[^"]*"|^[^"]*$)/)?.[0]

  if (dq != null && dq !== str) {
    return chalk.white(str.replace(dq, chalk.whiteBright(dq)))
  }

  return chalk.white(str)
}

const logEvents = {
  info: 'log:info',
  warn: 'log:warn',
  error: 'log:error',
}

const LoadingBarContainer = styled.div`
  position: relative;
  top: -10px;
  height: 1rem;
  /* margin-bottom: -0.5rem; */
  font-size: small;
  font-family: '"SF Mono", monospace';
  width: 98%;

  > * {
    position: absolute;
    inset: 0;
  }
`

const Container = styled.div<{ $bg: string }>`
  background: ${({ $bg }) => $bg};
`

const XTermComponent = styled(XTerm)`
  padding: 1rem 0.5rem 1rem 1rem;
`

const timer: NodeJS.Timeout | null = null

export default function Console({
  onSizeChange,
  ...props
}: ConsoleProps): JSX.Element {
  const ref = useRef<Xterm | null>(null)
  const addonFit = useMemo(() => new FitAddon(), [])
  const background = Color(useTheme().colors.surface).lighten(0.2).hex()
  // const [throughput, tickThroughput] = useThroughput(2000)
  const size = useRef('20%')

  // useEffect(() => {
  //   if (throughput >= 5) {
  //     if (size.current !== '40%') {
  //       size.current = '40%'

  //       onSizeChange(size.current)
  //     }

  //     if (timer != null) {
  //       clearTimeout(timer)
  //     }

  //     setTimeout(() => {
  //       if (throughput === 0) {
  //         if (size.current !== '20%') {
  //           size.current = '20%'
  //           onSizeChange(size.current)
  //         }
  //       }
  //     }, 5000)
  //   }
  // }, [onSizeChange])

  const termOptions: ITerminalOptions = useMemo(
    () => ({
      disableStdin: true,
      convertEol: true,
      fontSize: termStyle.fontSize,
      fontFamily: termStyle.fontFamily,
      cursorBlink: false,
      customGlyphs: true,
      // rendererType: 'dom',
      theme: {
        background,
        white: '#919191',
        red: '#ff4639',
        yellow: '#ffb311',
      },
    }),
    [background]
  )

  const resizeListener = useCallback(() => {
    addonFit.fit()
  }, [addonFit])

  const writeln = useCallback((data: string) => {
    const ln = `${prefix()} ${format(data)}`
    ref.current?.terminal?.writeln(ln)
  }, [])

  const logEventListeners = useMemo(() => {
    const info = (_: unknown, data: string) => {
      writeln(data)
    }

    const warn = (_: unknown, data: string) => {
      writeln(chalk.yellow(data))
    }

    const error = (_: unknown, data: string) => {
      writeln(chalk.red.bold(data))
    }

    return {
      info,
      warn,
      error,
    }
  }, [writeln])

  useEffect(() => {
    window.api?.on(logEvents.info, logEventListeners.info)
    window.api?.on(logEvents.warn, logEventListeners.warn)
    window.api?.on(logEvents.error, logEventListeners.error)

    ref.current?.terminal?.clear()
    writeln('Console started')

    window.addEventListener('resize', resizeListener)

    return () => {
      window.api?.off(logEvents.info, logEventListeners.info)
      window.api?.off(logEvents.warn, logEventListeners.warn)
      window.api?.off(logEvents.error, logEventListeners.error)

      window.removeEventListener('resize', resizeListener)
    }
  }, [
    logEventListeners.error,
    logEventListeners.info,
    logEventListeners.warn,
    resizeListener,
    writeln,
  ])

  useEffect(() => {
    addonFit.fit()
  }, [addonFit, props])

  return (
    <Container {...props} $bg={background}>
      <LoadingBarContainer>
        <LoadingBar />
      </LoadingBarContainer>
      <XTermComponent ref={ref} options={termOptions} addons={[addonFit]} />
    </Container>
  )
}
