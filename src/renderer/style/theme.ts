import { crimson, green, mauve, mauveDark, red, yellow } from '@radix-ui/colors'
import { DefaultTheme } from 'styled-components'
import theme from './theme.json'

type ColorRole =
  | 'primary'
  | 'surface'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger'

const alts = [
  'Base',
  'BgSubtle',
  'Bg',
  'BgHover',
  'BgActive',
  'Line',
  'Border',
  'BorderHover',
  'Solid',
  'SolidHover',
  'Text',
  'TextContrast',
] as const

type ColorRoleAlts = `${ColorRole}${typeof alts[number]}`

export type Colors = Record<ColorRoleAlts, string>

const createAliases = (
  color: Record<string, string>,
  role: ColorRole
): Record<ColorRoleAlts, string> => {
  const alias = {} as Record<string, string>
  const keys = Object.keys(color)

  for (let i = 0; i < keys.length; i += 1) {
    alias[`${role}${alts[i]}`] = color[keys[i]]
  }

  return alias
}

const sharedColors = [
  { name: 'accent', color: crimson },
  { name: 'success', color: green },
  { name: 'warning', color: yellow },
  { name: 'danger', color: red },
] as const

const lightThemeColors = [
  { name: 'primary', color: mauveDark },
  { name: 'surface', color: mauve },
] as const

const darkThemeColors = [
  { name: 'primary', color: mauve },
  { name: 'surface', color: mauveDark },
] as const

const createColorTheme = (colors: typeof sharedColors) => {
  return colors.reduce((acc, { name, color }) => {
    return {
      ...acc,
      ...createAliases(color, name),
    }
  }, {} as Colors)
}

const shared = createColorTheme(sharedColors)

const createTheme = (
  name: 'light' | 'dark',
  themeColors: typeof darkThemeColors | typeof lightThemeColors
): DefaultTheme => ({
  name,
  ...theme,
  colors: themeColors.reduce((acc, color) => {
    return {
      ...acc,
      ...createAliases(color.color, color.name),
    }
  }, shared),
})

export const lightTheme = createTheme('light', lightThemeColors)

export const darkTheme = createTheme('dark', darkThemeColors)
