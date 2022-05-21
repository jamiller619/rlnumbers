import chalk from 'chalk'
import Color from 'color'
import { HTMLAttributes, useCallback, useEffect, useMemo, useRef } from 'react'
import styled, { useTheme } from 'styled-components'
import { ITerminalOptions } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { XTerm } from 'xterm-for-react'
import Xterm from 'xterm-for-react/dist/src/XTerm'

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

export default function Console(
  props: HTMLAttributes<HTMLDivElement>
): JSX.Element {
  const ref = useRef<Xterm | null>(null)
  const addonFit = useMemo(() => new FitAddon(), [])
  const background = Color(useTheme().colors.surface).lighten(0.2).hex()

  const termOptions: ITerminalOptions = useMemo(
    () => ({
      disableStdin: true,
      convertEol: true,
      fontSize: termStyle.fontSize,
      fontFamily: termStyle.fontFamily,
      cursorBlink: false,
      customGlyphs: true,
      rendererType: 'dom',
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
      <XTerm ref={ref} options={termOptions} addons={[addonFit]} />
    </Container>
  )
}

const Container = styled.div<{ $bg: string }>`
  padding: 1rem 0 0 1rem;
  background: ${({ $bg }) => $bg};

  > div {
    height: 100%;
  }
`

const timeStampFormatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
})
