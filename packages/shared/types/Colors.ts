export type ColorRole =
  | 'primary'
  | 'surface'
  | 'accent'
  | 'error'
  | 'success'
  | 'warning'
  | 'info'

export const colorSteps = [
  'base',
  'bgSubtle',
  'bg',
  'bgHover',
  'bgActive',
  'line',
  'border',
  'borderHover',
  'solid',
  'solidHover',
  'text',
  'textContrast',
] as const

export type ColorStep = typeof colorSteps[number]

type Colors = Record<ColorRole, Record<ColorStep, string>>

export default Colors
