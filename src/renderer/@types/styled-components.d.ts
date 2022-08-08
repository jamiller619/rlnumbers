import 'styled-components'
import { BaseTheme, Colors } from '@shared/types'

declare module 'styled-components' {
  export interface DefaultTheme extends BaseTheme {
    colors: Colors
  }
}
