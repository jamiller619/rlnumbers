import { ReactNode } from 'react'
import { StyleSheetManager } from 'styled-components'
import ThemeProvider from './ThemeProvider'

type StyleProviderProps = {
  children: ReactNode
}

export default function StyleProvider({
  children,
}: StyleProviderProps): JSX.Element {
  return (
    <ThemeProvider>
      <StyleSheetManager disableVendorPrefixes>{children}</StyleSheetManager>
    </ThemeProvider>
  )
}
