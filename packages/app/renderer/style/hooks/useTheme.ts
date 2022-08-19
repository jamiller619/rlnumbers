import { useMemo } from 'react'
import { DefaultTheme } from 'styled-components'
import { ColorMode } from '@rln/shared/enums'
import { Colors } from '@rln/shared/types'
import { State, useStore } from '~/store'
import useColorMode from './useColorMode'

const selector = ({ theme }: State) => theme

export default function useTheme(): DefaultTheme | null {
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
