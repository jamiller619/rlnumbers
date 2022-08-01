import { Theme } from '../enums'

type Config = {
  dirs: string[] | null
  theme: Theme
  rrrocketVersion: string
}

export default Config

export type ConfigKey = keyof Config
export type ConfigValue = Config[ConfigKey]
