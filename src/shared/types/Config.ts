import { ColorMode } from '../enums'
import DotNotation from '../utils/DotNotation'

type Config = {
  dirs: string[] | null
  rrrocketVersion: string
  theme: {
    name: string
    colors: {
      mode: ColorMode
    }
  }
}

export default Config

export type ConfigKey = DotNotation<Config, string | string[] | ColorMode>
