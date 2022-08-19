import { useDarkMode } from 'usehooks-ts'
import { ColorMode } from '@rln/shared/enums'
import useConfig from '~/hooks/useConfig'

export default function useColorMode() {
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
