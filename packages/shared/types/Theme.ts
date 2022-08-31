import { Colors } from '~/types'

type Step3 = 'small' | 'medium' | 'large'
type Step5 = 'smaller' | Step3 | 'larger'
type Step7 = 'smallest' | Step5 | 'largest'

type CScale = {
  body: number
  heading: number
}

type SScale<T extends Step7> = {
  [key in T]: number | string | null
} & {
  [key: number]: number | string | null
}

export type BaseTheme = {
  name: string
  lineHeights: CScale
  fonts: CScale & {
    monospace: string
  }
  fontWeights: CScale
  fontSizes: SScale<Step7>
  radii: SScale<Step5>
  space: SScale<Step7>

  titlebar: {
    height: number
  }
}

type Theme = BaseTheme & {
  colors: {
    light: Colors
    dark: Colors
    shared?: Colors
  }
}

export default Theme
