import { Fragment, ReactNode, useMemo } from 'react'
import {
  StyleSheetManager,
  ThemeProvider,
  createGlobalStyle,
} from 'styled-components'
import reset from 'styled-reset'
import { useDarkMode } from 'usehooks-ts'
import { darkTheme, lightTheme } from './theme'

const GlobalStyle = createGlobalStyle`
  ${reset}

  body {
    background: ${({ theme }) => theme.colors.surfaceBase};
    color: ${({ theme }) => theme.colors.primaryBase};
    font-family: 'SF Mono', 'Segoe UI', sans-serif;
    font-size: 18px;
    font-weight: 400;
    -webkit-font-smoothing: antialiased;
    overflow: hidden;
  }

  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.primaryBg};
    border-radius: 6px;
    border: 3px solid ${({ theme }) => theme.colors.surfaceBorder};
    transition: background-color 2s ease-out;
  }

  ::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0);
  }
`

export default function StyleProvider({
  children,
}: {
  children: ReactNode
}): JSX.Element {
  const { isDarkMode } = useDarkMode()
  const theme = useMemo(
    () => (isDarkMode ? darkTheme : lightTheme),
    [isDarkMode]
  )

  return (
    <ThemeProvider theme={theme}>
      <StyleSheetManager disableVendorPrefixes>
        <Fragment>
          <GlobalStyle />
          {children}
        </Fragment>
      </StyleSheetManager>
    </ThemeProvider>
  )
}
