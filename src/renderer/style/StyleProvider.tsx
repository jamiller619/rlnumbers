import { Fragment, ReactNode } from 'react'
import { StyleSheetManager, createGlobalStyle } from 'styled-components'
import reset from 'styled-reset'
import ThemeProvider from './ThemeProvider'

const GlobalStyle = createGlobalStyle`
  ${reset}

  body {
    background: ${({ theme }) => theme.colors.surface.base};
    color: ${({ theme }) => theme.colors.primary.base};
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
    background-color: ${({ theme }) => theme.colors.primary.bg};
    border-radius: 6px;
    border: 3px solid ${({ theme }) => theme.colors.surface.border};
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
  return (
    <ThemeProvider>
      <StyleSheetManager disableVendorPrefixes>
        <Fragment>
          <GlobalStyle />
          {children}
        </Fragment>
      </StyleSheetManager>
    </ThemeProvider>
  )
}
