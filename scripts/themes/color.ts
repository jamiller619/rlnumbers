/**
 * This module is responsible for creating static json files
 * that can be used for the app's color scheme. Colors are
 * grouped by role, with each role containing 12 steps that
 * can be accessed by either index (starting from 1) or name:
 *  01 App background
 *  02 Subtle background
 *  03 UI element background
 *  04 Hovered UI element background
 *  05 Active / Selected UI element background
 *  06 Subtle borders and separators
 *  07 UI element border and focus rings
 *  08 Hovered UI element border
 *  09 Solid backgrounds
 *  10 Hovered solid backgrounds
 *  11 Low-contrast text
 *  12 High-contrast text
 */
import * as colors from '@radix-ui/colors'
import Colors, {
  ColorRole,
  colorSteps,
} from '../../packages/shared/types/Colors.js'

const createScale = (data: Record<string, string>, role: ColorRole) => {
  const scale = {} as Record<string, string>
  const keys = Object.keys(data)

  let i = 0,
    j = 0

  for (; i < keys.length; i += 1) {
    scale[colorSteps[i]] = data[keys[i]]
  }

  for (; j < keys.length; j += 1) {
    const step = (j + 1).toString().padStart(2, '0')

    scale[`step${step}`] = data[keys[j]]
  }

  return { [role]: scale }
}

type ColorMap = {
  name: ColorRole
  color: Record<string, string>
}

const { crimson, green, yellow, blue, red, mauve, mauveDark } = colors

export const shared: ColorMap[] = [
  { name: 'accent', color: crimson },
  { name: 'success', color: green },
  { name: 'warning', color: yellow },
  { name: 'error', color: red },
  { name: 'info', color: blue },
]

export const light: ColorMap[] = [
  { name: 'primary', color: mauveDark },
  { name: 'surface', color: mauve },
]

export const dark: ColorMap[] = [
  { name: 'primary', color: mauve },
  { name: 'surface', color: mauveDark },
]

const createTheme = (colors: ColorMap[]) => {
  return colors.reduce((acc, { name, color }) => {
    return {
      ...acc,
      ...createScale(color, name),
    }
  }, {} as Colors)
}

export default {
  light: createTheme(light),
  dark: createTheme(dark),
  shared: createTheme(shared),
}
