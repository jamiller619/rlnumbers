import 'styled-components'
import { BaseTheme, Colors } from '@rln/shared/types'

declare module 'styled-components' {
  export interface DefaultTheme extends BaseTheme {
    colors: Colors
  }
}
