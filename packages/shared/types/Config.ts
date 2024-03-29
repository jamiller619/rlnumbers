import { ColorMode } from '~/enums'
import DotNotation from '~/types/DotNotation'

export type DirConfig = {
  path: string
  recursive: boolean
  watch: boolean
}

type Config = {
  dirs: DirConfig[]
  rrrocketVersion: string
  theme: {
    name: string
    colors: {
      mode: ColorMode
    }
  }
}

export default Config

export type ConfigKey = DotNotation<
  Config,
  string | string[] | ColorMode | DirConfig[]
>
