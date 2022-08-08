import { ReactNode, useMemo } from 'react'
import {
  DefaultTheme,
  ThemeProvider as SCThemeProvider,
} from 'styled-components'
import { useDarkMode } from 'usehooks-ts'
import { ColorMode } from '@shared/enums'
import { Colors } from '@shared/types'
import useConfig from '~/hooks/useConfig'
import { State, useStore } from '~/store'

type ThemeProviderProps = {
  children: ReactNode
}

const selector = ({ theme }: State) => theme

const useColorMode = () => {
  const { isDarkMode } = useDarkMode()
  const { data: colorMode } = useConfig<ColorMode>('theme.colors.mode')

  switch (colorMode) {
    case ColorMode.AUTO:
      return isDarkMode ? ColorMode.DARK : ColorMode.LIGHT
    case ColorMode.DARK:
      return ColorMode.DARK
    default:
      return ColorMode.LIGHT
  }
}

const useTheme = (): DefaultTheme | null => {
  const theme = useStore(selector)
  const colorMode = useColorMode()
  const base = useMemo(() => {
    return theme != null
      ? colorMode === ColorMode.DARK
        ? theme.colors.dark
        : theme.colors.light
      : ({} as Colors)
  }, [colorMode, theme])
  const colors = useMemo(() => {
    return theme?.colors.shared != null
      ? { ...base, ...theme.colors.shared }
      : base
  }, [base, theme])

  return theme == null
    ? null
    : {
        ...theme,
        colors,
      }
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useTheme()

  return theme == null ? null : (
    <SCThemeProvider theme={theme}>{children}</SCThemeProvider>
  )
}
